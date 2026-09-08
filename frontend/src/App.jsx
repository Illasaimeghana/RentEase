import { useEffect, useState } from "react";
import Admin from "./Admin";

function App() {

  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [properties, setProperties] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const [showBooking, setShowBooking] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingDate, setBookingDate] = useState("");

  const [myBookings, setMyBookings] = useState([]);
  const [showMyBookings, setShowMyBookings] = useState(false);


  // LOAD PROPERTIES

  const loadProperties = () => {

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/properties.php"
    )
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
      })
      .catch((error) => {
        console.log("Property Error:", error);
      });

  };


  // LOAD USER FROM LOCAL STORAGE

  useEffect(() => {

    const savedUser = localStorage.getItem("renteaseUser");

    if (savedUser) {

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);
      setIsLoggedIn(true);

    }

  }, []);


  // LOAD PROPERTIES

  useEffect(() => {

    loadProperties();

  }, []);


  // LOAD MY BOOKINGS

  const loadMyBookings = () => {

    if (!user) {
      return;
    }

    fetch(
      `https://renteasey.infinityfreeapp.com/backend/my_bookings.php?user_id=${user.id}`
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to load bookings");
        }

        return response.json();

      })
      .then((data) => {

        console.log("My Bookings:", data);

        if (data.success) {
          setMyBookings(data.bookings);
        } else {
          setMyBookings([]);
        }

      })
      .catch((error) => {

        console.log("Booking Error:", error);

      });

  };


  // LOGIN

  const handleLogin = (e) => {

    e.preventDefault();

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/login.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {

        if (data.success) {

          setUser(data.user);
          setIsLoggedIn(true);

          localStorage.setItem(
            "renteaseUser",
            JSON.stringify(data.user)
          );

          setShowLogin(false);

          setLoginEmail("");
          setLoginPassword("");

          alert("Login successful!");

        } else {

          alert(data.message);

        }

      })
      .catch((error) => {

        console.log("Login Error:", error);

        alert("Login failed");

      });

  };


  // REGISTER

  const handleRegister = (e) => {

    e.preventDefault();

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/register.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {

        if (data.success) {

          alert("Registration successful! Please login.");

          setShowRegister(false);
          setShowLogin(true);

          setRegisterName("");
          setRegisterEmail("");
          setRegisterPassword("");

        } else {

          alert(data.message);

        }

      })
      .catch((error) => {

        console.log("Register Error:", error);

        alert("Registration failed");

      });

  };


  // LOGOUT

  const handleLogout = () => {

    setUser(null);
    setIsLoggedIn(false);
    setMyBookings([]);
    setShowMyBookings(false);

    localStorage.removeItem("renteaseUser");

  };


  // OPEN BOOKING

  const openBooking = (property) => {

    if (!isLoggedIn) {

      alert("Please login first to book a property.");

      setShowLogin(true);

      return;

    }

    setSelectedProperty(property);
    setBookingDate("");
    setShowBooking(true);

  };


  // BOOKING

  const handleBooking = (e) => {

    e.preventDefault();

    if (!user || !selectedProperty) {
      return;
    }

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/booking.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user.id,
          property_id: selectedProperty.Id,
          booking_date: bookingDate,
        }),

      }
    )
      .then((response) => response.json())
      .then((data) => {

        if (data.success) {

          alert("Booking created successfully!");

          setShowBooking(false);
          setSelectedProperty(null);
          setBookingDate("");

          loadMyBookings();

        } else {

          alert(data.message);

        }

      })
      .catch((error) => {

        console.log("Booking Error:", error);

        alert("Booking failed");

      });

  };


  // MY BOOKINGS

  const handleMyBookings = () => {

    if (!isLoggedIn) {

      alert("Please login first.");

      setShowLogin(true);

      return;

    }

    loadMyBookings();
    setShowMyBookings(true);

  };


  // CANCEL BOOKING

  const handleCancelBooking = (bookingId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/cancel_booking.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          booking_id: bookingId,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {

        alert(data.message);

        if (data.success) {
          loadMyBookings();
        }

      })
      .catch((error) => {

        console.log(
          "Cancel Booking Error:",
          error
        );

        alert("Failed to cancel booking");

      });

  };


  // FILTER PROPERTIES

  const filteredProperties = properties.filter(
    (property) => {

      const searchMatch =
        property.Title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        property.Location
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const locationMatch =
        locationFilter === "All" ||
        property.Location === locationFilter;

      let priceMatch = true;

      if (priceFilter === "Under10000") {
        priceMatch = Number(property.Price) < 10000;
      }

      if (priceFilter === "10000to20000") {
        priceMatch =
          Number(property.Price) >= 10000 &&
          Number(property.Price) <= 20000;
      }

      if (priceFilter === "Above20000") {
        priceMatch = Number(property.Price) > 20000;
      }

      return (
        searchMatch &&
        locationMatch &&
        priceMatch
      );

    }
  );


  return (

    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          RentEase
        </div>

        <div className="nav-links">

          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Home
          </button>

          <button
            onClick={() => {
              document
                .getElementById("properties-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Properties
          </button>

          {isLoggedIn && (
            <button onClick={handleMyBookings}>
              My Bookings
            </button>
          )}

          {!isLoggedIn ? (

            <>
              <button
                onClick={() => {
                  setShowLogin(true);
                  setShowRegister(false);
                }}
              >
                Login
              </button>

              <button
                onClick={() => {
                  setShowRegister(true);
                  setShowLogin(false);
                }}
              >
                Register
              </button>
            </>

          ) : (

            <>
              <span className="welcome-text">
                Welcome, {user.name}
              </span>

              <button onClick={handleLogout}>
                Logout
              </button>
            </>

          )}

        </div>

      </nav>


      {/* HERO */}

      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Find a Place You'll Love to Call Home
          </h1>

          <p>
            Discover comfortable and affordable
            rental properties in your preferred
            location. Browse properties, check
            details, choose your booking date,
            and manage your bookings — all in
            one place.
          </p>

          <button
            onClick={() => {
              document
                .getElementById("properties-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Explore Properties
          </button>

        </div>

      </section>


      {/* FEATURES */}

      <section className="features-section">

        <h2>
          Why Choose RentEase?
        </h2>

        <p className="features-subtitle">
          Everything you need to find and book
          your next rental property.
        </p>

        <div className="features-container">

          <div className="feature-card">

            <div className="feature-icon">
              🏠
            </div>

            <h3>
              Wide Range of Properties
            </h3>

            <p>
              Explore different rental properties
              and find a home that matches your needs.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📍
            </div>

            <h3>
              Easy Property Search
            </h3>

            <p>
              Search properties by name or location
              and use filters to find suitable options.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📅
            </div>

            <h3>
              Simple Booking
            </h3>

            <p>
              Choose your preferred property and
              booking date through a simple process.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📋
            </div>

            <h3>
              Manage Your Bookings
            </h3>

            <p>
              View and manage your property bookings
              easily from your personal account.
            </p>

          </div>

        </div>

      </section>


      {/* PROPERTIES */}

      <section
        className="properties-section"
        id="properties-section"
      >

        <h2>
          Available Properties
        </h2>

        <div className="property-filters">

          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <select
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
          >

            <option value="All">
              All Locations
            </option>

            <option value="Hyderabad">
              Hyderabad
            </option>

            <option value="Bangalore">
              Bangalore
            </option>

            <option value="Chennai">
              Chennai
            </option>

          </select>

          <select
            value={priceFilter}
            onChange={(e) =>
              setPriceFilter(e.target.value)
            }
          >

            <option value="All">
              All Prices
            </option>

            <option value="Under10000">
              Under ₹10,000
            </option>

            <option value="10000to20000">
              ₹10,000 - ₹20,000
            </option>

            <option value="Above20000">
              Above ₹20,000
            </option>

          </select>

        </div>


        <div className="properties-container">

          {filteredProperties.length === 0 ? (

            <p>
              No properties found.
            </p>

          ) : (

            filteredProperties.map(
              (property) => (

                <div
                  className="property-card"
                  key={property.Id}
                >

                  <img
                    src={`https://renteasey.infinityfreeapp.com/images/${property.Image}`}
                    alt={property.Title}
                  />

                  <div className="property-info">

                    <h3>
                      {property.Title}
                    </h3>

                    <p>
                      📍 {property.Location}
                    </p>

                    <p className="price">
                      ₹{property.Price} / month
                    </p>

                    <p>
                      {property.Description}
                    </p>

                    <button
                      onClick={() =>
                        openBooking(property)
                      }
                    >
                      Book Now
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </section>


      {/* LOGIN MODAL */}

      {showLogin && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() =>
                setShowLogin(false)
              }
            >
              ×
            </button>

            <h2>
              Login to RentEase
            </h2>

            <form onSubmit={handleLogin}>

              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                required
              />

              <button type="submit">
                Login
              </button>

            </form>

            <p>
              Don't have an account?{" "}

              <button
                className="switch-button"
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register
              </button>
            </p>

          </div>

        </div>

      )}


      {/* REGISTER MODAL */}

      {showRegister && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() =>
                setShowRegister(false)
              }
            >
              ×
            </button>

            <h2>
              Create RentEase Account
            </h2>

            <form onSubmit={handleRegister}>

              <input
                type="text"
                placeholder="Full Name"
                value={registerName}
                onChange={(e) =>
                  setRegisterName(e.target.value)
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) =>
                  setRegisterEmail(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) =>
                  setRegisterPassword(e.target.value)
                }
                required
              />

              <button type="submit">
                Register
              </button>

            </form>

            <p>
              Already have an account?{" "}

              <button
                className="switch-button"
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login
              </button>
            </p>

          </div>

        </div>

      )}


      {/* BOOKING MODAL */}

      {showBooking && selectedProperty && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() =>
                setShowBooking(false)
              }
            >
              ×
            </button>

            <h2>
              Book Property
            </h2>

            <h3>
              {selectedProperty.Title}
            </h3>

            <p>
              📍 {selectedProperty.Location}
            </p>

            <p>
              ₹{selectedProperty.Price} / month
            </p>

            <form onSubmit={handleBooking}>

              <label>
                Select Booking Date
              </label>

              <input
                type="date"
                value={bookingDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setBookingDate(e.target.value)
                }
                required
              />

              <button type="submit">
                Confirm Booking
              </button>

            </form>

          </div>

        </div>

      )}


      {/* MY BOOKINGS MODAL */}

      {showMyBookings && (

        <div className="modal-overlay">

          <div className="modal bookings-modal">

            <button
              className="close-button"
              onClick={() =>
                setShowMyBookings(false)
              }
            >
              ×
            </button>

            <h2>
              My Bookings
            </h2>

            {myBookings.length === 0 ? (

              <p>
                You don't have any bookings yet.
              </p>

            ) : (

              <div className="bookings-list">

                {myBookings.map(
                  (booking) => (

                    <div
                      className="booking-card"
                      key={booking.BookingId}
                    >

                      <h3>
                        {booking.Title}
                      </h3>

                      <p>
                        📍 {booking.Location}
                      </p>

                      <p>
                        💰 ₹{booking.Price} / month
                      </p>

                      <p>
                        📅 Booking Date:{" "}
                        {booking.BookingDate}
                      </p>

                      <p>
                        Status:

                        <span className="booking-status">
                          {booking.Status}
                        </span>
                      </p>

                      <button
                        className="cancel-booking-btn"
                        onClick={() =>
                          handleCancelBooking(
                            booking.BookingId
                          )
                        }
                      >
                        Cancel Booking
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      )}


      {/* REVIEWS */}

      <section className="reviews-section">

        <h2>
          What Our Users Say
        </h2>

        <p className="reviews-subtitle">
          A simple and convenient way to find your next rental home.
        </p>

        <div className="reviews-container">

          <div className="review-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "RentEase made it really easy for me to
              find a suitable apartment. The booking
              process was simple and quick."
            </p>

            <h4>
              — Rahul
            </h4>

          </div>


          <div className="review-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "I liked the property search and filters.
              It helped me find properties within my
              preferred budget."
            </p>

            <h4>
              — Priya
            </h4>

          </div>


          <div className="review-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "The booking and My Bookings features
              are very easy to use. Overall a smooth
              rental experience."
            </p>

            <h4>
              — Arjun
            </h4>

          </div>

        </div>

      </section>


      {/* CONTACT */}

      <section className="contact-section">

        <div className="contact-content">

          <div className="contact-info">

            <h2>
              Get in Touch
            </h2>

            <p>
              Have questions about a property or your
              booking? We're here to help.
            </p>


            <div className="contact-item">

              <span>
                📧
              </span>

              <div>

                <strong>
                  Email
                </strong>

                <p>
                  support@rentease.com
                </p>

              </div>

            </div>


            <div className="contact-item">

              <span>
                📞
              </span>

              <div>

                <strong>
                  Phone
                </strong>

                <p>
                  +91 90000 00000
                </p>

              </div>

            </div>


            <div className="contact-item">

              <span>
                📍
              </span>

              <div>

                <strong>
                  Location
                </strong>

                <p>
                  Hyderabad, India
                </p>

              </div>

            </div>

          </div>


          <div className="contact-box">

            <h3>
              Need Help?
            </h3>

            <p>
              Our support team can help you with
              property information, bookings and
              general queries.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "mailto:support@rentease.com";
              }}
            >
              Contact Support
            </button>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-container">


          <div className="footer-brand">

            <h2>
              RentEase
            </h2>

            <p>
              Find comfortable and affordable rental
              properties with ease.
            </p>

          </div>


          <div className="footer-column">

            <h3>
              Quick Links
            </h3>

            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });
              }}
            >
              Home
            </button>

            <button
              onClick={() => {
                document
                  .getElementById(
                    "properties-section"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth"
                  });
              }}
            >
              Properties
            </button>

            <button
              onClick={handleMyBookings}
            >
              My Bookings
            </button>

          </div>


          <div className="footer-column">

            <h3>
              Support
            </h3>

            <button
              onClick={() => {
                window.location.href =
                  "mailto:support@rentease.com";
              }}
            >
              Contact Us
            </button>

            <button
              onClick={() => {
                alert(
                  "For help with properties and bookings, contact support@rentease.com"
                );
              }}
            >
              Help & Support
            </button>

            <button
              onClick={() => {
                alert(
                  "RentEase Privacy Policy: Your account information is used only for providing rental services."
                );
              }}
            >
              Privacy Policy
            </button>

          </div>


          <div className="footer-column">

            <h3>
              RentEase
            </h3>

            <p>
              🏠 Easy Property Search
            </p>

            <p>
              📅 Simple Booking
            </p>

            <p>
              📋 Booking Management
            </p>

          </div>


        </div>


        <div className="footer-bottom">

          <p>
            © 2026 RentEase. All rights reserved.
          </p>

        </div>

      </footer>


    </div>

  );
}

export default App;
