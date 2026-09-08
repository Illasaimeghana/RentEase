import { useEffect, useState } from "react";

function Admin() {

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [properties, setProperties] = useState([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");

  const [editingId, setEditingId] = useState(null);


  // =============================
  // LOAD PROPERTIES
  // =============================

  const loadProperties = () => {

    fetch("https://renteasey.infinityfreeapp.com/backend/properties.php")

      .then((response) => response.json())

      .then((data) => {
        setProperties(data);
      })

      .catch((error) => {
        console.log("Property Error:", error);
      });

  };


  useEffect(() => {

    if (isAdmin) {
      loadProperties();
    }

  }, [isAdmin]);


  // =============================
  // ADMIN LOGIN
  // =============================

  const handleAdminLogin = (e) => {

    e.preventDefault();

    fetch("https://renteasey.infinityfreeapp.com/backend/admin_login.php", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),

    })

      .then((response) => response.json())

      .then((data) => {

        if (data.success) {

          alert("Admin login successful!");

          setIsAdmin(true);

          setAdminEmail("");
          setAdminPassword("");

        } else {

          alert(data.message);

        }

      })

      .catch((error) => {

        console.log("Admin Login Error:", error);

        alert("Admin login failed");

      });

  };


  // =============================
  // CLEAR FORM
  // =============================

  const clearForm = () => {

    setTitle("");
    setLocation("");
    setPrice("");
    setDescription("");

    setImageFile(null);
    setImageName("");

    setEditingId(null);

  };


  // =============================
  // IMAGE UPLOAD
  // =============================

  const uploadImage = async () => {

    if (!imageFile) {
      return "";
    }

    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await fetch(
      "https://renteasey.infinityfreeapp.com/backend/upload_image.php",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {

      alert(data.message);

      return "";

    }

    return data.fileName;

  };


  // =============================
  // ADD PROPERTY
  // =============================

  const handleAddProperty = async (e) => {

    e.preventDefault();

    let uploadedImage = imageName;

    if (imageFile) {

      uploadedImage = await uploadImage();

      if (!uploadedImage) {
        return;
      }

    }

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/add_property.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title,
          location: location,
          price: price,
          description: description,
          image: uploadedImage,
        }),
      }
    )

      .then((response) => response.json())

      .then((data) => {

        alert(data.message);

        if (data.success) {

          clearForm();

          loadProperties();

        }

      })

      .catch((error) => {

        console.log("Add Property Error:", error);

        alert("Failed to add property");

      });

  };


  // =============================
  // EDIT PROPERTY
  // =============================

  const handleEdit = (property) => {

    setEditingId(property.Id);

    setTitle(property.Title);
    setLocation(property.Location);
    setPrice(property.Price);
    setDescription(property.Description);

    setImageName(property.Image);

    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =============================
  // UPDATE PROPERTY
  // =============================

  const handleUpdateProperty = async (e) => {

    e.preventDefault();

    let updatedImage = imageName;

    if (imageFile) {

      updatedImage = await uploadImage();

      if (!updatedImage) {
        return;
      }

    }

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/update_property.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: editingId,
          title: title,
          location: location,
          price: price,
          description: description,
          image: updatedImage,
        }),
      }
    )

      .then((response) => response.json())

      .then((data) => {

        alert(data.message);

        if (data.success) {

          clearForm();

          loadProperties();

        }

      })

      .catch((error) => {

        console.log("Update Property Error:", error);

        alert("Failed to update property");

      });

  };


  // =============================
  // DELETE PROPERTY
  // =============================

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(
      "https://renteasey.infinityfreeapp.com/backend/delete_property.php",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: id,
        }),
      }
    )

      .then((response) => response.json())

      .then((data) => {

        alert(data.message);

        if (data.success) {
          loadProperties();
        }

      })

      .catch((error) => {

        console.log("Delete Property Error:", error);

        alert("Failed to delete property");

      });

  };


  // =============================
  // ADMIN LOGIN PAGE
  // =============================

  if (!isAdmin) {

    return (

      <div className="admin-page">

        <div className="admin-login">

          <h1>RentEase Admin</h1>

          <h2>Admin Login</h2>

          <form onSubmit={handleAdminLogin}>

            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) =>
                setAdminEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) =>
                setAdminPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Login
            </button>

          </form>

        </div>

      </div>

    );

  }


  // =============================
  // ADMIN DASHBOARD
  // =============================

  return (

    <div className="admin-page">

      <div className="admin-header">

        <h1>
          RentEase Admin Dashboard
        </h1>

        <button
          onClick={() => {

            setIsAdmin(false);

            clearForm();

          }}
        >
          Logout
        </button>

      </div>


      {/* =============================
          ADD / UPDATE FORM
      ============================= */}

      <div className="admin-form">

        <h2>
          {editingId
            ? "Update Property"
            : "Add New Property"}
        </h2>


        <form
          onSubmit={
            editingId
              ? handleUpdateProperty
              : handleAddProperty
          }
        >

          <input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />


          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            required
          />


          <input
            type="number"
            placeholder="Monthly Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            required
          />


          <textarea
            placeholder="Property Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />


          <label>
            Property Image
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              setImageFile(e.target.files[0]);

            }}
          />


          {imageName && !imageFile && (

            <p>
              Current Image: {imageName}
            </p>

          )}


          <button type="submit">

            {editingId
              ? "Update Property"
              : "Add Property"}

          </button>


          {editingId && (

            <button
              type="button"
              onClick={clearForm}
            >
              Cancel Edit
            </button>

          )}

        </form>

      </div>


      {/* =============================
          EXISTING PROPERTIES
      ============================= */}

      <div className="admin-properties">

        <h2>
          Existing Properties
        </h2>


        {properties.length === 0 ? (

          <p>
            No properties available.
          </p>

        ) : (

          properties.map((property) => (

            <div
              className="admin-property-card"
              key={property.Id}
            >

             <img
  src={`https://renteasey.infinityfreeapp.com/images/${property.Image}`}
  alt={property.Title}
/>

              <div>

                <h3>
                  {property.Title}
                </h3>

                <p>
                  📍 {property.Location}
                </p>

                <p>
                  ₹{property.Price} / month
                </p>

                <p>
                  {property.Description}
                </p>


                <button
                  onClick={() =>
                    handleEdit(property)
                  }
                >
                  Edit
                </button>


                <button
                  onClick={() =>
                    handleDelete(property.Id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );
}

export default Admin;
