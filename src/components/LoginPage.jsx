import { useState, useEffect } from 'react'; // Import useEffect
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Form, Button, Container, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../firebase';
import { setUser } from '../store/slices/authSlice';

const LoginPage = () => {
    // console.log(process.env.REACT_APP_API_BASE_URL) // Keep commented out or remove in production
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('phone');
    const [verificationId, setVerificationId] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // --- State for Resend OTP ---
    const [resendTimer, setResendTimer] = useState(0); // Timer countdown
    const [canResend, setCanResend] = useState(false); // Controls if resend is possible
    const RESEND_DELAY = 30; // Seconds to wait before allowing resend
    // --- End State for Resend OTP ---

    const navigate = useNavigate();

    // --- Timer Effect ---
    useEffect(() => {
        let interval;
        if (step === 'otp' && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (resendTimer === 0 && step === 'otp') {
            setCanResend(true); // Enable resend button when timer hits 0
        }

        // Cleanup interval on component unmount or step change
        return () => clearInterval(interval);
    }, [resendTimer, step]);
    // --- End Timer Effect ---

    const handleTermsAccepted = (e) => {
        setAcceptedTerms(e.target.checked);
    };
    const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number);
    const validateOtp = (otp) => /^[0-9]{6}$/.test(otp);

    const handleGoogleLogin = async () => {
        if (!acceptedTerms) {
            setError('Please accept the Terms and Conditions to continue.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const name = user.displayName;
            const email = user.email;
            const uuid = user.uid;
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/create_user`, {
                name,
                uuid,
                email,
            });
            localStorage.setItem('elk_authorization_token', response.data.data.token);
            dispatch(setUser({
                user: response.data.data,
                token: response.data.data.token,
                isAdmin: response.data.data.is_admin
            }))
            navigate('/home');
        } catch (error) {
            console.error('Google Login Error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                setError('Login popup closed before completion. Please try again.');
            } else {
                setError('Google sign-in failed. Please try again.' + error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (isResend = false) => {
        // Don't send if already loading, or if it's not a resend and terms aren't accepted
        if (loading || (!isResend && !acceptedTerms)) {
             if (!acceptedTerms) setError('Please accept the Terms and Conditions to continue.');
             return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setError(''); // Clear previous errors
        setLoading(true);
        setCanResend(false); // Disable resend initially
        setResendTimer(RESEND_DELAY); // Start timer

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/send_otp`, { mobile: `+91${phoneNumber}` }); // Ensure +91 prefix
            setStep('otp');
            setVerificationId(response.data.verificationId)
            // No need to alert on successful resend, maybe a subtle message?
            if(isResend) console.log("OTP Resent");

        } catch (error) {
            console.error('Error sending OTP:', error);
            setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
            setCanResend(true); // Allow retry immediately on error
            setResendTimer(0);  // Stop timer on error
        } finally {
            setLoading(false);
        }
    };

    // Handle verifying OTP
    const handleVerifyOtp = async () => {
         if (!acceptedTerms) { // Also check terms here
            setError('Please accept the Terms and Conditions to continue.');
            return;
        }
        if (!validateOtp(otp)) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/verify_otp`, { verificationId: verificationId, otp: otp });
            localStorage.setItem('elk_authorization_token', response.data.data.token);
            dispatch(setUser({
                user: response.data.data,
                token: response.data.data.token,
                isAdmin: response.data.data.is_admin
            }))
            navigate('/home');
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Container>
                <Card className="shadow-lg p-4 border-0 rounded-4 mx-auto" style={{ maxWidth: '400px' }}>
                    <Card.Body>
                        <h3 className="text-center mb-3" style={{ fontWeight: 'bold', color: '#4FBBB4' }}>
                            {step === 'phone' ? 'Welcome Back!' : 'Enter OTP'}
                        </h3>
                        <p className="text-muted text-center mb-4">
                            {step === 'phone'
                                ? 'Login or Sign Up with your phone number'
                                : `OTP sent to +91 ${phoneNumber}`} {/* Show number */}
                        </p>

                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                        <Form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
                            {step === 'phone' && (
                                <Form.Group controlId="phoneNumber" className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>+91</InputGroup.Text>
                                        <Form.Control
                                            type="tel"
                                            placeholder="Enter 10-digit number" // Shortened placeholder
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setPhoneNumber(value);
                                            }}
                                            maxLength={10}
                                            required // Added required
                                        />
                                    </InputGroup>
                                </Form.Group>
                            )}

                            {step === 'otp' && (
                                <Form.Group controlId="otp" className="mb-3">
                                    <Form.Label>Enter OTP</Form.Label>
                                    <Form.Control
                                        className='mb-2' // Reduced bottom margin
                                        type="text" // Use text for better mobile input handling
                                        inputMode="numeric" // Hint for numeric keyboard
                                        pattern="\d{6}" // Basic pattern validation
                                        maxLength={6} // Limit length
                                        placeholder="6-digit OTP" // Updated placeholder
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtp(value);
                                        }}
                                        required // Added required
                                    />
                                    {/* --- Resend OTP Section --- */}
                                    <div className="text-end">
                                        {canResend ? (
                                            <Button variant="link" size="sm" onClick={() => handleSendOtp(true)} disabled={loading}>
                                                Resend OTP
                                            </Button>
                                        ) : (
                                            <span className="text-muted small">
                                                Resend OTP in {resendTimer}s
                                            </span>
                                        )}
                                    </div>
                                    {/* --- End Resend OTP Section --- */}
                                </Form.Group>
                            )}

                            {/* Terms Checkbox - Moved higher for visibility */}
                            <Form.Group controlId="termsCheck" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={handleTermsAccepted}
                                    label={
                                        <span style={{ fontSize: '14px' }}>
                                            I accept the{' '}
                                            <Link to="/terms" target="_blank" rel="noopener noreferrer">
                                                Terms and Conditions
                                            </Link>
                                        </span>
                                    }
                                />
                            </Form.Group>


                            <Button
                                type={step === 'phone' ? 'button' : 'submit'} // Use submit for OTP step for potential enter key press
                                className="w-100 py-2"
                                onClick={step === 'phone' ? () => handleSendOtp(false) : handleVerifyOtp} // Pass false for initial send
                                style={{
                                    fontWeight: 'bold',
                                    letterSpacing: '0.5px',
                                    backgroundColor: '#fdd77f',
                                    borderColor: '#fdd77f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                }}
                                disabled={loading || !acceptedTerms} // Disable if loading or terms not accepted
                            >
                                {loading && <Spinner as="span" animation="border" size="sm" />}
                                {step === 'phone' ? 'Send OTP' : 'Verify OTP'}
                            </Button>
                        </Form>

                        <div className="text-center my-3 position-relative"> {/* Added my-3 and relative positioning */}
                             <hr /> {/* Horizontal line */}
                             <span style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'white', // Match card background
                                    padding: '0 10px', // Space around the "or"
                                    color: '#6c757d' // Muted color
                                }}>or</span>
                         </div>

                        <Button
                            variant="outline-dark"
                            className="w-100 py-2"
                            onClick={handleGoogleLogin}
                            disabled={loading || !acceptedTerms} // Also disable if terms not accepted
                        >
                            <img
                                src="https://developers.google.com/identity/images/g-logo.png"
                                alt="Google"
                                style={{ width: 20, marginRight: 10 }}
                            />
                            Continue with Google
                        </Button>

                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default LoginPage;