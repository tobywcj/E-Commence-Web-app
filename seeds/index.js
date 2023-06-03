const mongoose = require('mongoose');
const Shop = require('../models/shop');
const cities = require('./cities');
const sneaksAPI = require('sneaks-api');
const { places, descriptors } = require('./seedHelpers');

mongoose.set('strictQuery', true); // ensure that only the fields that are specified in your schema will be saved in the database
mongoose.connect('mongodb://localhost:27017/SneakerApp', {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}).catch(error => console.log(error));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"))
db.once("open", () => console.log("Database connected successfully"));

const sneaks = new sneaksAPI();


const sample = array => array[Math.floor(Math.random() * array.length + 1)];

const seedDB = async () => {
    await Shop.deleteMany({});
  
    function getMostPopularSneaker(limit) {
      return new Promise((resolve, reject) => {
        sneaks.getMostPopular(limit, function (err, products) {
          if (err) {
            reject(err);
          } else {
            const sneakers = products;
            resolve(sneakers);
          }
        });
      });
    }
  
    try { 
      const sneakers = await getMostPopularSneaker(400);
      console.log(`Only return ${sneakers.length} sneakers`);

      for (let i = 0; i < sneakers.length ; i++) {
        const random1000 = Math.floor(Math.random() * 1000 + 1);
        const shop = new Shop({
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          name: `${sample(descriptors)} ${sample(places)}`,
          category: 'Sneakers',
          description: sneakers[i].description,
          // your user ID
          author:'64529976a82196d2c2a3b0a9',
          reviews: [],
          images: [
            {
              url: sneakers[i].thumbnail,
              filename: 'SneakerApp/ahfnenvca4tha00h2ubt'
            }
          ],
          geometry: {
            type: 'Point',
            coordinates: [cities[random1000].longitude, cities[random1000].latitude] 
          }
        });
        await shop.save();
      }
    } catch { err => console.error(err); }
  };

seedDB().then(() => {
    db.close();
    console.log('Database connection closed')
});


// <% for (let product of products) {%>

//   <div class="card mt-3 p-2 col-4" style="display: inline">
//     <% if(product.thumbnail.length) { %>
//       <img crossorigin="anonymous" class="img-fluid rounded card-img-top" src="<%= product.thumbnail %>" alt="">
//         <% } else { %>
//                 <img crossorigin="anonymous" class="img-fluid rounded card-img-top" src="https://images.stockx.com/images/Gallery-Dept-Sun-Faded-English-Logo-Hoodie-Black.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&trim=color&q=90&dpr=2&updated_at=1660895550" alt="">
//                 <% } %>

//                 <div class="card-body">
//                     <h5 class="card-title"><%= product.shoeName %></h5>
//                     <p class="card-text fs-3 fw-light">Lowest Ask</p>
//                     <p class="card-text">USD$
//                         <% const lowestPrice = Math.min(...Object.values(product.lowestResellPrice)); %>
//                         <%= lowestPrice %>
//                     </p>
//                 </div>
//             </div>
            
//         <% } %>