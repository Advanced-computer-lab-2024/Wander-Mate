<h1 align="center">
  <br>
  <a><img src="src/frontend_react/src/Wandermate_logo.svg" alt="Markdownify" width="200"></a>
  <br>
  Wander-Mate
  <br>
</h1>
<h1 align="center"># Wander Mate: Your Travelling Best Mate</h1>

<h4 align="center">A modern, intuitive travel planning and itinerary management tool to help users explore the world effortlessly.</h4>

---

## Motivation

The goal of Wander-Mate is to make travel planning more convenient and enjoyable by offering a comprehensive platform where users can book everything they need for their vacation in one place. Whether it’s flights, hotels, activities, transportation, itinerary planning, or even products to buy, our platform streamlines the entire process, eliminating the need to search across multiple sites.

By simplifying and centralizing travel arrangements, we hope to reduce the stress and complexity often associated with planning trips. Our aim is to make the experience of traveling not only easier but also more exciting. We believe that by providing travelers with a seamless and hassle-free booking process, we can inspire more people to explore new destinations and embark on memorable journeys with confidence.

---

## user complains

When cancelling a booking the money is not fully returned to the user wallet as there are cancellation fees by the hotel

---

## Code Style

Our project follows a modular and structured code style to ensure maintainability and scalability. The backend is designed to support various user roles, including tourists, tour guides, sellers, advertisers, tourism governors, and admins, each with their own set of methods for interacting with the platform. Each user role is represented by a dedicated model, which encapsulates the relevant data and functionality specific to that role.

Additionally, we have multiple models to represent key entities within the platform, such as products, orders, bookings, and more. These models are used to manage and interact with the data efficiently.

The frontend is built using **React**, and it communicates seamlessly with the backend via API endpoints. This enables users to access and interact with the platform's features in real-time, whether it's booking a flight, managing an itinerary, or processing an order.

### Key Code Style Guidelines:

- **Consistency**:  
  We use consistent naming conventions for variables, functions, and models to make the code easy to read and understand.

- **Modular Structure**:  
  The project is divided into clear modules for both the backend and frontend, following the single responsibility principle.

- **CamelCase Naming**:  
  For variables and functions, we use `camelCase` to maintain consistency with JavaScript conventions.

- **Model Representation**:  
  Each entity in the application, whether a user role or a core feature like products and bookings, is represented by its own model.

- **React Best Practices**:  
  The frontend is built with React, using functional components, hooks, and a state management system (e.g., Context API or Redux) to ensure maintainable and reusable code.

- **API Integration**:  
  All frontend components interact with the backend through API calls, adhering to RESTful conventions and ensuring a smooth user experience.

This structured approach ensures that the codebase remains clean, efficient, and easy to extend as new features are added.

---
## Screenshots

![Preview](1.png)
![Preview](3.png)
![Preview](4.png)
![Preview](5.png)
![Preview](6.png)
![Preview](8.png)
![Preview](10.png)
![Preview](11.png)
![Preview](12.png)
---

## Tech/Framework Used

- **Frontend**: React
- **Backend**: JavaScript ,Node.js
- **Database**: MongoDB
- **APIs**:  Google Maps and MapBox API ,Rapid API Trip Advisor for hotels ,Amadeues API for flights ,EmailJs API for emails 

---

## Features
**Tourist could:**
- **Hotel & Flight Booking**: Tourists can book hotels and flights directly through the platform.
- **Activity and Itinerary Booking**: Browse and book a wide range of activities for a complete travel experience.
- **Place Discovery**: View and explore recommended places to visit at your destination.
- **Souvenir Shopping**: Tourists can buy souvenir products from the website.
- **Real-time Notifications**: Receive notifications and emails about new activities or upcoming itinerary starts.
- **Ratings & Reviews**: Tourists can rate and write reviews for activities, Itineraries and Products.
- **Wishlist & Cart**: Add products to your wishlist, then move them to the cart for easy checkout.
- **Multiple Payment Options**: Pay for products using your wallet in the app, credit card, or cash on delivery.
- **Delivery Address Selection**: Choose a preferred delivery address for your purchased products.
- **Discount Vouchers**: Receive vouchers for discounts, which can be redeemed at any time.
- **Loyalty Points & Badges**: Earn loyalty points with every booking or payment, and watch your badge level increase as you accumulate points.
  
**Tour Guide could:**
- **View Itinerary Report**: Tour guides can view reports of their itineraries, including the number of bookings and the names of tourists who booked them.
- **Add New Itinerary**: Tour guides can add new itineraries to the website, making them available for tourists to book.

**Seller could:**
- **View Order Report**: Sellers can view a report of all orders made by tourists who purchase their products.
- **Add New Product**: Sellers can add new products to the website and publish them for tourists to purchase.

**Tourism Governor could:**
- **Add Historical Tags**: Tourism governors can add historical tags to various destinations and attractions.
- **Add New Places**: Tourism governors can add new places to the website that tourists can visit.

**Advertiser could:**
- **Add Activities**: Advertisers can add activities to the platform, making them available for tourists to book.
- **View Booked Activity Report**: Advertisers can view a report of activities that have been booked by tourists.

**Admin could:**
- **View All Orders**: Admins can view all orders made by tourists.
- **View All Products**: Admins can view all products listed on the website.
- **View All Itineraries**: Admins can view all itineraries available for booking.
- **View All Complaints**: Admins can view all complaints submitted by tourists.
- **View All Activities**: Admins can view all activities listed on the platform.
- **View All Documents**: Admins can view all documents uploaded by stakeholders.
- **Track Revenues and Sales**: Admins can view total revenues and sales data.
- **Track Order Status**: Admins can check the status of all orders.
- **Add New Product**: Admins can add new products to the website.
---
## How to Run the Code in the Terminal

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd src
   cd backend
   node app.js OR nodemon app.js
### Running the Backend
2. Navigate to the frontend directory:
   ```bash
   cd src
   cd frontend_react
   npm start

## Code Examples

Code Example for API call for the emails

```javascript
// Example of calling the emailjs api
const reply = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.EMAILJS_PRIVATE_KEY_2}`,
      },
      body: JSON.stringify(data),
    });
    console.log(reply);

    res.status(200).json({
      message: "Notification added successfully for admin.",
      notification,
    });
  } catch (error) {
    console.error("Error adding notification for admin:", error);
    res.status(500).json({ error: "Failed to add notification for admin." });
  }
};
```
Code Example and how to make for adding item to cart

Here is the cart model
```javascript
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  name: {
    type: String,
    required: true, // The name of the product
  },
  price: {
    type: Number,
    required: true, // Price per unit
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1
  },
  total: {
    type: Number, // Calculated as price * quantity
  },
  attributes: {
    type: Map, // Key-value pairs for product-specific attributes like size, color
    of: String,
    default: {},
  },
  picture: {
    type: String,
  },
});

CartItemSchema.pre("save", function (next) {
  // Automatically calculate total
  this.total = this.price * this.quantity;
  next();
});

const CartSchema = new mongoose.Schema({
  touristID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tourist",
  },
  items: [CartItemSchema], // Array of cart items
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of when the cart was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp of last cart update
  },
});

CartSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.total = item.price * item.quantity;
  });

  // Calculate `subtotal` as the sum of all `total` fields
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  next();
});

module.exports = mongoose.model("Cart", CartSchema);
```
the  backend method
```javascript
const addItemToCart = async (req, res) => {
  const { touristID, productId, name, price, picture } = req.body;
  let { quantity, attributes } = req.body;
  if (!touristID || !productId || !name || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!quantity) {
    quantity = 1;
  }
  if (!attributes) {
    attributes = {};
  }
  try {
    // Find the user's cart
    let cart = await Cart.findOne({ touristID });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ touristID, items: [] });
    }

    // Check if the product with the same attributes is already in the cart
    const existingItem = cart.items.find((item) => {
      item.productId.toString() === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(attributes);
    });

    if (existingItem) {
      // Increment the quantity if the same product with the same attributes exists
      existingItem.quantity += quantity;
    } else {
      // Add a new item with attributes
      cart.items.push({
        productId,
        name,
        price,
        quantity,
        attributes,
        picture,
      });
    }

    // Save the updated cart
    await cart.save();
    return res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error adding item to cart" });
  }
};
```
here is calling the method in app.js
```javascript
app.post("/addItemToCart", upload.single("picture"), addItemToCart);
```
here how it is connected to the frontend
```javascript
 const handleAddToCart = async () => {
    setIsAdded(true);
    if (!isInStock()) return;
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();
      const response = await axios.post(`http://localhost:8000/addItemToCart`, {
        touristID: userID,
        productId: product.productId,
        name: product.name,
        price: product.price,
        picture: product.image,
      });
    } catch (error) {
      console.error("Error adding to cart data:", error);
    }
  };
```
code snippet for search hotel using api
```javascript
const searchHotel = async (req, res) => {
  const { place, checkInDate, checkOutdate } = req.body;
  try {
    const locationData = await searchHotellocation(place);
    if (!locationData || !locationData.data || locationData.data.length === 0) {
      return res.status(400).json({ message: "No location data found" });
    }

    const geoId = locationData.data[0].geoId;
    const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=${geoId}&checkIn=${checkInDate}&checkOut=${checkOutdate}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1e3f65aa5cmsh39a2d77a5006638p1059c7jsnfd6b183ccc4e",
        "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const hotelData = await response.json();

    if (!hotelData || !hotelData.data || hotelData.data.length === 0) {
      return res.status(400).json({ message: "No hotels found" });
    }

    // Extract relevant details including photos
    const hotels = hotelData.data.data.slice(0, 10).map((hotel) => ({
      id: hotel.id,
      title: hotel.title,
      price: hotel.priceForDisplay || "N/A",
      rating: hotel.bubbleRating ? hotel.bubbleRating.rating : "N/A",
      provider: hotel.provider || "N/A",
      cancellationPolicy: hotel.priceDetails || "N/A",
      isSponsored: hotel.isSponsored || false,
      cardPhotos: hotel.cardPhotos
        ? hotel.cardPhotos.map((photo) =>
            photo.sizes.urlTemplate
              .replace("{width}", "400")
              .replace("{height}", "300")
          )
        : [], // Default to empty array if no photos
    }));

    res.status(200).json(hotels);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
```
code snippet for Search flights using the api
```javascript
const SearchFlights = async (req, res) => {
  const { origin, destination, departureDate, returnDate } = req.query;

  // Validate input
  if (!origin || !destination || !departureDate) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    // Get the OAuth access token
    const accessToken = await getAmadeusToken();

    // Call the flight search API with the access token
    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate,
          returnDate: returnDate || undefined, // Omit returnDate if it's an empty string
          adults: 1, // Use 'adults' instead of 'travelers'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Log the response for debugging
    console.log("Flight search response:", response.data);

    // Return the available flights
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching flights:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Failed to search flights",
      error: error.response ? error.response.data : error.message,
    });
  }
};
```
Code snippet for login 
```javascript
const login = async (req, res) => {
  try {
    const { Username, Password, rememberMe } = req.body;

    // Check if both fields are provided
    if (!Username || !Password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    }

    const user = await userModel.findOne({ Username: Username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    let userLogged;
    let status = "";
    switch (user.Type) {
      case "Admin":
        userLogged = await adminModel.findOne({ Username: Username });
        break;
      case "Tourist":
        userLogged = await touristModel.findOne({ Username: Username });
        break;
      case "Seller":
        userLogged = await sellerModel.findOne({ Username: Username });
        status = userLogged.status;
        break;
      case "TourGuide":
        userLogged = await tourGuideModel.findOne({ Username: Username });
        status = userLogged.status;
        break;
      case "TourismGoverner":
        userLogged = await TourismGoverner.findOne({ Username: Username });
        break;
      case "Advertiser":
        userLogged = await advertiserModel.findOne({ Username: Username });
        status = userLogged.status;
        break;
    }

    // Check if the admin exists in the database
    if (!userLogged) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const saltRounds = 10;
    const isPasswordValid = await bcrypt.compare(Password, userLogged.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    // Create a session or token (if using JWT, generate a token here)
    // Example using JWT:
    const token = createToken(userLogged.Username);
    const cookieOptions = {
      httpOnly: true,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
    };

    res.cookie("jwt", token, cookieOptions);
    res
      .status(200)
      .json({
        Username: Username,
        Type: user.Type,
        status,
        curr: userLogged.Currency,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
```
Code snippet for fetching the favourite itineraries in the frontend-react
```javascript
    const fetchFavorite = async () => {
      try {
        const username = sessionStorage.getItem("username");
        if (!username) {
          console.log("No username found in session storage");
          setFavorite(false);  // Set to false if no user is logged in
          return;
        }

        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");
    
        const { userID } = await reply.json();
        const response = await fetch(`http://localhost:8000/checkIfEventBookmarked`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userID,
            eventId: itineraryId,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const data = await response.json();
        setFavorite(data);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
        setFavorite(false);  // Set to false in case of any error
      }
    };
```
Code snippet for sending a notification that an itinerary is now available
```javascript
  const handleNotifyMe = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get user ID");

      const { userID } = await reply.json();
      console.log(itinerary.itineraryId);
      const response = await axios.post(
        "http://localhost:8000/requestToBeNotified",
        {
          touristId: userID,
          itineraryId: itinerary.itineraryId,
        }
      );
      if (response.status === 200) {
        toast.success("You will be notified when it starts taking bookings!");
      } else {
        toast.error("Failed to request to be notified");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to request to be notified");
    }
  };
```
Here is the code snippet for fetching the product details in the frontend-react
```javascript
const fetchData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get tourist ID");

        const { userID } = await reply.json();
        setUserID(userID);

        const response = await axios.put("http://localhost:8000/isInWishlist", {
          productId: productId,
          touristId: userID,
        });

        if (response.status === 200) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
```
Here is a code snippet for adding a new admin
```javascript
export async function addAdmin(username, password) {
  try {
    const usernameFromSession = sessionStorage.getItem("username")
    
    // Assuming the backend has an 'addAdmin' API endpoint
    const response = await fetch('http://localhost:8000/addAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Username: username, Password: password, CreatedBy: usernameFromSession }), // Adding created by field
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create admin')
    }

    // Handle successful creation (optional - you can manage any additional status like tokens if needed)
    return {  success:  toast.success("Admin added successfully."),  message: 'Admin created successfully'  }
  } catch (error) {
    console.error('Error creating admin:', error)
    return { success: toast.error("Can't create the admin")
    , message: "Can't create the admin" }
  }
}
```
Code snippet for fetching the details of a Place
```javascript
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("http://localhost:8000/getCategories");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Could not load categories. Please try again later.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTags = async () => {
    try {
      setLoadingTags(true);
      const response = await fetch("http://localhost:8000/readHistoricalTags");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Could not load tags. Please try again later.");
    } finally {
      setLoadingTags(false);
    }
  };
```
Code snippet for fetching the complaints
```javascript
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/viewAllComplaints"
        );
        if (response.status === 200) {
          const complaintsData = response.data.complaints;

          // Fetch user data for each complaint
          const userCache = {}; // Cache to avoid duplicate API calls
          const enrichedComplaints = await Promise.all(
            complaintsData.map(async (complaint) => {
              if (!userCache[complaint.userId]) {
                const userResponse = await axios.get(
                  `http://localhost:8000/getUsername/${complaint.Maker}`
                );

                userCache[complaint.userId] = userResponse.data;
              }
              return {
                ...complaint,
                userName: userCache[complaint.userId],
              };
            })
          );


          setComplaints(enrichedComplaints);
        } else {
          setError("No complaints found.");
        }
      } catch (err) {
        setError("Failed to fetch complaints.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
```
Code for fetching all the orders
```javascript
  const fetchOrders = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:8000/getMyOrders/${userID}`);
      const ordersWithOpenDetails = response.data.orders.map(order => ({
        ...order,
        openOrderDetails: () => setSelectedOrder(order),
        cancelOrder: (orderId) => handleCancelOrder(orderId)
      }));
      setOrders(ordersWithOpenDetails);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Could not load orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
```
Code for paying by wallet
```javascript
  const handleWallet = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const reply = await fetch(`http://localhost:8000/getID/${username}`);
      if (!reply.ok) throw new Error("Failed to get tourist ID");

      const { userID } = await reply.json();

      const response = await axios.put("http://localhost:8000/payWithWallet", {
        touristID: userID,
        amount,
      });

      if (response.status === 200) {
        setAlertMessage(null);
        await handlePaymentSuccess();
        handleNextSlide();
      } else {
        setAlertMessage(response.data || "Payment failed.");
      }
    } catch (error) {
      console.error("Wallet payment error:", error);
      setAlertMessage("An error occurred during the transaction.");
    }
  };
```

---
## Testing
- **Testing using Postman**: We take the url added in the app.js and add it postman to view for ex.
  
 1. app.get("/viewBoughtProducts/:touristId", viewBoughtProducts);
  
 2. app.get("/readItinerary/:id", readItinerary);
  

  **the desired outcome here is an example for:**

- Viewing the product i bought

![Preview](Test1.png)
---
- viewing the itinerary details
  
![Preview](pt1.png)
![Preview](pt2.png)
![Preview](pt3.png)

---
## Installations 
- **Vs Code link:** [Vs Code](https://code.visualstudio.com/download)
- **MongoDB link:** [Mongo DB](https://www.mongodb.com/try/download/community)
- **Postman link:** [Postman](https://www.postman.com/downloads/)
- **Node.js link:** [Node.js](https://nodejs.org/en/download/package-manager)
- **React link:** [React](https://react.dev/learn/installation)
- **Express link:** [Express](https://expressjs.com)
---
## License

This project is licensed under the following licenses:

- **BSD-3-Clause**: This project includes dependencies licensed under the BSD-3-Clause License.
- **Apache-2.0**: This project includes dependencies licensed under the Apache License 2.0.
- **ISC**: This project includes dependencies licensed under the ISC License.
- **0BSD**: This project includes dependencies licensed under the 0BSD License.
- **BSD-2-Clause**: This project includes dependencies licensed under the BSD-2-Clause License.
- **AGPL-3.0**: This project includes dependencies licensed under the Affero General Public License v3.0.
- **MIT**: This project includes dependencies licensed under the MIT License.


### Third-Party Licenses:
- **Stripe**: This project uses Stripe for payment processing. Stripe is licensed under the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0).
---
## Credits

We would like to acknowledge the following resources and tools used during the development of this project:

1. **V0 by Vercel**: A useful resource for frontend development and deployment.
2. **CMS GUC**: The content management system used for learning skills needed for achieving the goals of the project more efficiently - [cms.guc.edu.eg](https://cms.guc.edu.eg).
3. **Lucide Logos**: Icon set used for various UI components.
4. **Mahara Tech**: For contributing technical expertise in the development of the project and learning MERN stack.
5. **ChatGPT**: Used for assistance with coding, problem-solving and error handling.
6. **YouTube**: A valuable resource for tutorials, coding guides, and problem-solving.

### API References

1. **Hotel API (using RapidAPI)**  
   Website: [RapidAPI](https://rapidapi.com)  
   Actual API in Code: https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${place}



2. **Flight API (using Amadeus)**  
Website: [Amadeus](https://amadeus.com/en)  
Actual API in Code: https://test.api.amadeus.com/v2/shopping/flight-offers



3. **Transactions API (using Stripe)**  
Website: [Stripe](https://stripe.com/pricing)  
Actual API in Code: stripe/react-stripe-js



4. **Email API (using EmailJS)**  
Website: [EmailJS](https://www.emailjs.com/)  
Actual API in Code: https://api.emailjs.com/api/v1.0/email/send



5. **Map Box API (using Mapbox Maps)**  
Website: [Mapbox](https://www.mapbox.com)  
Actual API in Code: https://maps.googleapis.com/maps/api/js?key=AIzaSyCUGuPbWdSWysqduevM3zHurxQAf8cFyTY&libraries=places&callback=initMap

6. **Currency exchange API (using currency exchange)**  
Website: [Currency Exchange](https://www.exchangerate-api.com)
Actual API in Code: https://api.exchangerate-api.com/v4/latest/${c}


## Contribute

We welcome contributions from the open-source community! Whether you have an idea for a new feature, a bug fix, or even an improvement to the documentation, we encourage you to get involved in order to reach the best vesrsion of your travelling mate.

Please follow the guidelines below to ensure that your contributions are easy to review and integrate:

### How to Contribute:
1. **Fork the Repository**: Fork the repository to your GitHub account.
2. **Clone the Forked Repository**: Clone your fork locally to make changes.
   ```bash
   git clone https://github.com/Advanced-computer-lab-2024/Wander-Mate.git

