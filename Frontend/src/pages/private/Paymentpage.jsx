import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios.js';
import { CreditCard, Smartphone, Building2, Lock, CheckCircle2, Download, Home, PlayCircle, Mail, GraduationCap, Trophy, AlertCircle} from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get course details from navigation state
  const { courseDetails } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Card payment state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  // UPI payment state
  const [upiId, setUpiId] = useState('');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    if (!courseDetails) {
      navigate('/courses');
    }
  }, [courseDetails, navigate]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setCardDetails({ ...cardDetails, [name]: formatCardNumber(value) });
    } else if (name === 'expiryDate') {
      setCardDetails({ ...cardDetails, [name]: formatExpiryDate(value) });
    } else if (name === 'cvv') {
      setCardDetails({ ...cardDetails, [name]: value.replace(/\D/g, '').substring(0, 3) });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const validateCardDetails = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = cardDetails;

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardHolder.trim()) {
      setError('Please enter card holder name');
      return false;
    }
    if (expiryDate.length !== 5) {
      setError('Please enter valid expiry date (MM/YY)');
      return false;
    }

    const [month, year] = expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (parseInt(month) > 12 || parseInt(month) < 1) {
      setError('Invalid expiry month');
      return false;
    }
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      setError('Card has expired');
      return false;
    }
    if (cvv.length !== 3) {
      setError('Please enter valid CVV');
      return false;
    }
    return true;
  };

  const validateUPI = () => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(upiId)) {
      setError('Please enter a valid UPI ID');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (paymentMethod === 'card' && !validateCardDetails()) {
        setLoading(false);
        return;
      } else if (paymentMethod === 'upi' && !validateUPI()) {
        setLoading(false);
        return;
      } else if (paymentMethod === 'netbanking' && !selectedBank) {
        setError('Please select a bank');
        setLoading(false);
        return;
      }

      const paymentData = {
        paymentMethod,
        amount: courseDetails.price,
        courseId: courseDetails._id,
        courseName: courseDetails.courseName || courseDetails.title,
        teacherName: courseDetails.teacherName || courseDetails.instructor,
      };

      if (paymentMethod === 'card') {
        paymentData.cardDetails = {
          cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
          cardHolder: cardDetails.cardHolder,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
        };
      } else if (paymentMethod === 'upi') {
        paymentData.upiId = upiId;
      } else if (paymentMethod === 'netbanking') {
        paymentData.bank = selectedBank;
      }

      const response = await api.post('/api/payments/process', paymentData);

      if (response.data.success) {
        setTransactionId(response.data.transactionId);
        setPaymentComplete(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!courseDetails) return null;

  // SUCCESS VIEW
  if (paymentComplete) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '800px',
          background: 'white',
          borderRadius: '1.5rem',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #48bb78, #38a169)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2 size={48} color="white" strokeWidth={3} />
            </div>
          </div>

          <h1 style={{ fontSize: '2.5rem', color: '#2d3748', marginBottom: '0.5rem', fontWeight: '700' }}>
            Payment Successful!
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#718096', marginBottom: '2rem' }}>
            Your payment has been processed. Your booking status is <strong>Pending Admin Approval</strong>. You will be able to access the course once the admin approves your enrollment.
          </p>

          <div style={{
            background: '#f7fafc',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '1.25rem', color: '#2d3748', marginBottom: '1.5rem', textAlign: 'center' }}>
              Transaction Details
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Transaction ID:</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>{transactionId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Course:</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>{courseDetails.title}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Amount Paid:</span>
              <span style={{ color: '#48bb78', fontWeight: '600', fontSize: '1.125rem' }}>
                ₹{(courseDetails.price * 1.18).toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
              <span style={{ color: '#718096', fontWeight: '500' }}>Date:</span>
              <span style={{ color: '#2d3748', fontWeight: '600' }}>
                {new Date().toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <button onClick={() => navigate('/mycourses')} style={{
              padding: '1rem 2rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
            }}>
              <PlayCircle size={20} /> View My Courses
            </button>
            <button onClick={() => window.print()} style={{
              padding: '1rem 2rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: 'white', color: '#667eea', border: '2px solid #667eea',
            }}>
              <Download size={20} /> Download Receipt
            </button>
            <button onClick={() => navigate('/')} style={{
              padding: '1rem 2rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: '#edf2f7', color: '#4a5568', border: 'none',
            }}>
              <Home size={20} /> Back to Home
            </button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#2d3748', marginBottom: '1.5rem' }}>What's Next?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f7fafc, #edf2f7)', borderRadius: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Mail size={32} color="#667eea" />
                </div>
                <h4 style={{ fontSize: '1rem', color: '#2d3748', marginBottom: '0.5rem' }}>Check Your Email</h4>
                <p style={{ fontSize: '0.875rem', color: '#718096', lineHeight: '1.5' }}>
                  We've sent a confirmation email with your payment receipt and booking details
                </p>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #fff5f5, #fef2f2)', borderRadius: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <AlertCircle size={32} color="#f56565" />
                </div>
                <h4 style={{ fontSize: '1rem', color: '#2d3748', marginBottom: '0.5rem' }}>Pending Approval</h4>
                <p style={{ fontSize: '0.875rem', color: '#718096', lineHeight: '1.5' }}>
                  Your booking is pending admin approval. Check "My Courses" for status updates
                </p>
              </div>
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f7fafc, #edf2f7)', borderRadius: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Trophy size={32} color="#667eea" />
                </div>
                <h4 style={{ fontSize: '1rem', color: '#2d3748', marginBottom: '0.5rem' }}>Start Learning</h4>
                <p style={{ fontSize: '0.875rem', color: '#718096', lineHeight: '1.5' }}>
                  Once approved, you can access the course and earn your certificate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PAYMENT VIEW
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>Complete Your Payment</h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>Secure payment for your course enrollment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
          {/* Order Summary */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#2d3748' }}>Order Summary</h2>
            
            <div style={{
              display: 'flex', gap: '1rem', marginBottom: '1.5rem',
              paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0',
            }}>
              <img 
                src={courseDetails.image || '/default-course.jpg'} 
                alt={courseDetails.title}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <div>
                <h3 style={{ fontSize: '1rem', color: '#2d3748', marginBottom: '0.25rem' }}>{courseDetails.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#718096' }}>{courseDetails.instructor}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#4a5568' }}>
                <span>Course Price</span>
                <span>₹{courseDetails.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#4a5568' }}>
                <span>Tax (18% GST)</span>
                <span>₹{(courseDetails.price * 0.18).toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.25rem',
                color: '#2d3748', paddingTop: '1rem', borderTop: '2px solid #e2e8f0', marginTop: '1rem',
              }}>
                <span>Total Amount</span>
                <span>₹{(courseDetails.price * 1.18).toFixed(2)}</span>
              </div>
            </div>
            
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#48bb78',
              fontSize: '0.875rem', background: '#f0fdf4', padding: '0.75rem', borderRadius: '0.5rem',
            }}>
              <Lock size={16} />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Payment Form */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#2d3748' }}>Payment Method</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <button onClick={() => setPaymentMethod('card')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                padding: '1.5rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.875rem',
                border: paymentMethod === 'card' ? '2px solid #667eea' : '2px solid #e2e8f0',
                background: paymentMethod === 'card' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' : 'white',
                color: paymentMethod === 'card' ? '#667eea' : '#4a5568',
              }}>
                <CreditCard size={24} />
                <span>Card</span>
              </button>
              
              <button onClick={() => setPaymentMethod('upi')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                padding: '1.5rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.875rem',
                border: paymentMethod === 'upi' ? '2px solid #667eea' : '2px solid #e2e8f0',
                background: paymentMethod === 'upi' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' : 'white',
                color: paymentMethod === 'upi' ? '#667eea' : '#4a5568',
              }}>
                <Smartphone size={24} />
                <span>UPI</span>
              </button>
              
              <button onClick={() => setPaymentMethod('netbanking')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                padding: '1.5rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.875rem',
                border: paymentMethod === 'netbanking' ? '2px solid #667eea' : '2px solid #e2e8f0',
                background: paymentMethod === 'netbanking' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' : 'white',
                color: paymentMethod === 'netbanking' ? '#667eea' : '#4a5568',
              }}>
                <Building2 size={24} />
                <span>Banking</span>
              </button>
            </div>

            <form onSubmit={handlePayment} style={{ marginTop: '2rem' }}>
              {paymentMethod === 'card' && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.5rem', color: '#2d3748', fontWeight: '600', fontSize: '0.875rem'
                    }}>Card Number</label>
                    <input type="text" name="cardNumber" value={cardDetails.cardNumber}
                      onChange={handleCardChange} placeholder="1234 5678 9012 3456" required
                      style={{
                        width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.5rem', color: '#2d3748', fontWeight: '600', fontSize: '0.875rem'
                    }}>Card Holder Name</label>
                    <input type="text" name="cardHolder" value={cardDetails.cardHolder}
                      onChange={handleCardChange} placeholder="JOHN DOE" required
                      style={{
                        width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block', marginBottom: '0.5rem', color: '#2d3748', fontWeight: '600', fontSize: '0.875rem'
                      }}>Expiry Date</label>
                      <input type="text" name="expiryDate" value={cardDetails.expiryDate}
                        onChange={handleCardChange} placeholder="MM/YY" required
                        style={{
                          width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block', marginBottom: '0.5rem', color: '#2d3748', fontWeight: '600', fontSize: '0.875rem'
                      }}>CVV</label>
                      <input type="text" name="cvv" value={cardDetails.cvv}
                        onChange={handleCardChange} placeholder="123" required
                        style={{
                          width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.5rem', color: '#2d3748', fontWeight: '600', fontSize: '0.875rem'
                    }}>UPI ID</label>
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi" required
                      style={{
                        width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box',
                      }}
                    />
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#718096' }}>
                      Enter your UPI ID (e.g., username@paytm)
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.5rem', color: '#2d3748', fontWeight: '600', fontSize: '0.875rem'
                    }}>Select Your Bank</label>
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} required
                      style={{
                        width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Choose a bank</option>
                      <option value="chase">Chase Bank</option>
                      <option value="bofa">Bank of America</option>
                      <option value="hsbc">HSBC</option>
                      <option value="citi">Citibank</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0.5rem',
                  marginBottom: '1.5rem', background: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2',
                }}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '1rem', border: 'none', borderRadius: '0.5rem',
                fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? '0.6' : '1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}>
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Lock size={18} />
                    Pay ₹{(courseDetails.price * 1.18).toFixed(2)}
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#718096' }}>
                By completing this payment, you agree to our{' '}
                <a href="/terms" style={{ color: '#667eea', textDecoration: 'none' }}>Terms of Service</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;