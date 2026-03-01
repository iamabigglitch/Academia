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
        background: 'linear-gradient(135deg, #48557e 0%, #626e94 100%)',
        padding: '6rem 1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          {/* Success Icon and Header */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }} className="no-print">
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #48bb78, #38a169)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <CheckCircle2 size={40} color="white" strokeWidth={3} />
            </div>
            <h1 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '0.5rem', fontWeight: '700' }}>
              Payment Successful!
            </h1>
            <p style={{ fontSize: '1rem', color: '#718096', marginBottom: '0' }}>
              Your payment has been processed. Your booking status is <strong>Pending Admin Approval</strong>.
            </p>
          </div>

          {/* Transaction Details - Printable */}
          <div style={{
            background: '#f7fafc',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{ fontSize: '1.125rem', color: '#2d3748', marginBottom: '1rem', textAlign: 'center', fontWeight: '600' }}>
              Transaction Details
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#718096', fontWeight: '500', fontSize: '0.9rem' }}>Transaction ID:</span>
              <span style={{ color: '#2d3748', fontWeight: '600', fontSize: '0.9rem' }}>{transactionId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#718096', fontWeight: '500', fontSize: '0.9rem' }}>Course:</span>
              <span style={{ color: '#2d3748', fontWeight: '600', fontSize: '0.9rem' }}>{courseDetails.title}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#718096', fontWeight: '500', fontSize: '0.9rem' }}>Amount Paid:</span>
              <span style={{ color: '#1c398e', fontWeight: '700', fontSize: '1.125rem' }}>
                ₹{(courseDetails.price * 1.18).toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
              <span style={{ color: '#718096', fontWeight: '500', fontSize: '0.9rem' }}>Date:</span>
              <span style={{ color: '#2d3748', fontWeight: '600', fontSize: '0.9rem' }}>
                {new Date().toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons - Not printable */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }} className="no-print">
            <button onClick={() => navigate('/mycourses')} style={{
              padding: '0.875rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none',
              background: '#1c398e', color: 'white', transition: 'all 0.2s',
            }}>
              <PlayCircle size={18} /> View My Courses
            </button>
            <button onClick={() => window.print()} style={{
              padding: '0.875rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: 'white', color: '#1c398e', border: '2px solid #1c398e', transition: 'all 0.2s',
            }}>
              <Download size={18} /> Download Receipt
            </button>
            <button onClick={() => navigate('/')} style={{
              padding: '0.875rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: '#f7fafc', color: '#4a5568', border: 'none', transition: 'all 0.2s',
            }}>
              <Home size={18} /> Back to Home
            </button>
          </div>

          {/* What's Next Section - Not printable */}
          <div style={{ marginTop: '1.5rem' }} className="no-print">
            <h3 style={{ fontSize: '1.25rem', color: '#2d3748', marginBottom: '1rem', fontWeight: '600' }}>What's Next?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #f0f4ff, #e6eeff)', borderRadius: '0.75rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <Mail size={28} color="#1c398e" />
                </div>
                <h4 style={{ fontSize: '0.95rem', color: '#2d3748', marginBottom: '0.4rem', fontWeight: '600' }}>Check Your Email</h4>
                <p style={{ fontSize: '0.8rem', color: '#718096', lineHeight: '1.4', margin: 0 }}>
                  Confirmation email with receipt sent
                </p>
              </div>
              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #fff5f5, #fef2f2)', borderRadius: '0.75rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <AlertCircle size={28} color="#e53e3e" />
                </div>
                <h4 style={{ fontSize: '0.95rem', color: '#2d3748', marginBottom: '0.4rem', fontWeight: '600' }}>Pending Approval</h4>
                <p style={{ fontSize: '0.8rem', color: '#718096', lineHeight: '1.4', margin: 0 }}>
                  Check "My Courses" for status updates
                </p>
              </div>
              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #f0f4ff, #e6eeff)', borderRadius: '0.75rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <Trophy size={28} color="#1c398e" />
                </div>
                <h4 style={{ fontSize: '0.95rem', color: '#2d3748', marginBottom: '0.4rem', fontWeight: '600' }}>Start Learning</h4>
                <p style={{ fontSize: '0.8rem', color: '#718096', lineHeight: '1.4', margin: 0 }}>
                  Access course once approved
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            * { margin: 0; padding: 0; }
            body { margin: 0; padding: 0; background: white !important; }
            .no-print { display: none !important; }
            nav { display: none !important; }
            header { display: none !important; }
            [class*="navbar"] { display: none !important; }
            [class*="Navbar"] { display: none !important; }
            div[style*="background: linear-gradient"] { background: white !important; }
          }
        `}</style>
      </div>
    );
  }

  // PAYMENT VIEW
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1c398e 0%, #8d95ad 100%)',
      padding: '6rem 1rem 2rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Complete Your Payment</h1>
          <p style={{ fontSize: '1rem', opacity: '0.95' }}>Secure payment for your course enrollment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Order Summary */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.75rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            height: 'fit-content',
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#2d3748', fontWeight: '600' }}>Order Summary</h2>
            
            <div style={{
              display: 'flex', gap: '1rem', marginBottom: '1.25rem',
              paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0',
            }}>
              <img 
                src={courseDetails.image || '/default-course.jpg'} 
                alt={courseDetails.title}
                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <div>
                <h3 style={{ fontSize: '0.95rem', color: '#2d3748', marginBottom: '0.25rem', fontWeight: '600' }}>{courseDetails.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>{courseDetails.instructor}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#4a5568', fontSize: '0.9rem' }}>
                <span>Course Price</span>
                <span>Rs: {courseDetails.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#4a5568', fontSize: '0.9rem' }}>
                <span>Tax (18% GST)</span>
                <span>Rs: {(courseDetails.price * 0.18).toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.15rem',
                color: '#2d3748', paddingTop: '0.875rem', borderTop: '2px solid #e2e8f0', marginTop: '0.875rem',
              }}>
                <span>Total Amount</span>
                <span style={{ color: '#1c398e' }}>₹{(courseDetails.price * 1.18).toFixed(2)}</span>
              </div>
            </div>
            
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#48bb78',
              fontSize: '0.825rem', background: '#f0fdf4', padding: '0.75rem', borderRadius: '0.5rem',
            }}>
              <Lock size={14} />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Payment Form */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.75rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#2d3748', fontWeight: '600' }}>Payment Method</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setPaymentMethod('card')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                padding: '1.25rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem',
                border: paymentMethod === 'card' ? '2px solid #1c398e' : '2px solid #e2e8f0',
                background: paymentMethod === 'card' ? 'rgba(28, 57, 142, 0.05)' : 'white',
                color: paymentMethod === 'card' ? '#1c398e' : '#4a5568', fontWeight: '600',
              }}>
                <CreditCard size={22} />
                <span>Card</span>
              </button>
              
              <button onClick={() => setPaymentMethod('upi')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                padding: '1.25rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem',
                border: paymentMethod === 'upi' ? '2px solid #1c398e' : '2px solid #e2e8f0',
                background: paymentMethod === 'upi' ? 'rgba(28, 57, 142, 0.05)' : 'white',
                color: paymentMethod === 'upi' ? '#1c398e' : '#4a5568', fontWeight: '600',
              }}>
                <Smartphone size={22} />
                <span>UPI</span>
              </button>
              
              <button onClick={() => setPaymentMethod('netbanking')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                padding: '1.25rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem',
                border: paymentMethod === 'netbanking' ? '2px solid #1c398e' : '2px solid #e2e8f0',
                background: paymentMethod === 'netbanking' ? 'rgba(28, 57, 142, 0.05)' : 'white',
                color: paymentMethod === 'netbanking' ? '#1c398e' : '#4a5568', fontWeight: '600',
              }}>
                <Building2 size={22} />
                <span>Banking</span>
              </button>
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod === 'card' && (
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.4rem', color: '#2d3748', fontWeight: '600', fontSize: '0.85rem'
                    }}>Card Number</label>
                    <input type="text" name="cardNumber" value={cardDetails.cardNumber}
                      onChange={handleCardChange} placeholder="1234 5678 9012 3456" required
                      style={{
                        width: '100%', padding: '0.75rem 0.875rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.4rem', color: '#2d3748', fontWeight: '600', fontSize: '0.85rem'
                    }}>Card Holder Name</label>
                    <input type="text" name="cardHolder" value={cardDetails.cardHolder}
                      onChange={handleCardChange} placeholder="Enter Your Full Name" required
                      style={{
                        width: '100%', padding: '0.75rem 0.875rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{
                        display: 'block', marginBottom: '0.4rem', color: '#2d3748', fontWeight: '600', fontSize: '0.85rem'
                      }}>Expiry Date</label>
                      <input type="text" name="expiryDate" value={cardDetails.expiryDate}
                        onChange={handleCardChange} placeholder="MM/YY" required
                        style={{
                          width: '100%', padding: '0.75rem 0.875rem', border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{
                        display: 'block', marginBottom: '0.4rem', color: '#2d3748', fontWeight: '600', fontSize: '0.85rem'
                      }}>CVV</label>
                      <input type="text" name="cvv" value={cardDetails.cvv}
                        onChange={handleCardChange} placeholder="123" required
                        style={{
                          width: '100%', padding: '0.75rem 0.875rem', border: '2px solid #e2e8f0',
                          borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.4rem', color: '#2d3748', fontWeight: '600', fontSize: '0.85rem'
                    }}>UPI ID</label>
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi" required
                      style={{
                        width: '100%', padding: '0.75rem 0.875rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box',
                      }}
                    />
                    <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#718096', margin: '0.4rem 0 0 0' }}>
                      Enter your UPI ID 
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{
                      display: 'block', marginBottom: '0.4rem', color: '#2d3748', fontWeight: '600', fontSize: '0.85rem'
                    }}>Select Your Bank</label>
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} required
                      style={{
                        width: '100%', padding: '0.75rem 0.875rem', border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box',
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
                  display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.875rem', borderRadius: '0.5rem',
                  marginBottom: '1.25rem', background: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2',
                  fontSize: '0.875rem',
                }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '0.875rem', border: 'none', borderRadius: '0.5rem',
                fontSize: '1rem', fontWeight: '600', marginBottom: '0.875rem',
                background: '#1c398e', color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? '0.6' : '1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}>
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Lock size={16} />
                    Pay Rs:{(courseDetails.price * 1.18).toFixed(2)}
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#718096', margin: 0 }}>
                By completing this payment, you agree to our{' '}
                <a href="/terms" style={{ color: '#1c398e', textDecoration: 'none' }}>Terms of Service</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;