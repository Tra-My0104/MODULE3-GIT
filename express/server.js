// Bước 1 : khởi tạo server
const express = require("express");
const server = express();
const fs = require("fs");
const bodyParser = require("body-parser");

// Định nghĩa các HTTP request để hứng
// request từ phía client

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.json({
    message: "Hello world !!!",
  });
});

server.get("/users", (req, res) => {
  //  console.log(req.params);
  // get query string
  console.log("lll");
  try {
    let users = JSON.parse(fs.readFileSync("./database/users.json"));
    let { lat, lng } = req.query;
    console.log(req.query);
    if (lat && lng) {
      // get users from database that have same condition
      let result = users.filter(
        (e) => e.address.geo.lat === lat && e.address.geo.lng === lng
      );
      //   console.log(result);
      res.json(result);
    } else {
      res.json(users);
    }
  } catch (error) {
    res.json({
      error,
    });
  }
});

server.get("/users/:id", (req, res) => {
  let { id } = req.params;
  try {
    let users = JSON.parse(fs.readFileSync("./database/users.json"));
    let findUser = users.find((user) => user.id === +id);
    console.log(findUser);
    if (findUser) {
      res.json(findUser);
    } else {
      res.json({
        messages: "User not found",
      });
    }
  } catch (error) {
    res.json({
      error,
    });
  }
});

server.post("/users", (req, res) => {
  let { username, email } = req.body;
  if (!username || !email) {
    res.json({
      message: "Email hoặc username không hợp lệ",
    });
  } else {
    let newUser = {
      id: Math.floor(Math.random() * 10000000000),
      name: null,
      username: username,
      email: email,
      address: {
        street: null,
        suite: null,
        city: null,
        zipcode: null,
        geo: {
          lat: null,
          lng: null,
        },
      },
      phone: null,
      website: null,
      company: {
        name: null,
        catchPhrase: null,
        bs: null,
      },
    };
    try {
      let users = JSON.parse(fs.readFileSync("./database/users.json"));
      users.push(newUser);
      fs.writeFileSync("./database/users.json", JSON.stringify(users));
      res.json({
        message: "create user successfully",
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  }
});

server.put("/users/:id", (req, res) => {
  let { id } = req.params;
  let { name, phone } = req.body;

  try {
    // tìm kiếm users trong database thông qua id
    let users = JSON.parse(fs.readFileSync("./database/users.json"));
    let findUsers = users.findIndex((e) => e.id === +id);
    //-Nếu không tìm thấy -----> res về lỗi
    if(!name || !phone) {
        res.json({
            message : ("name và phone đang để trống")
        })
    } else {
        //-Nếu tìm thấy
        users[findUsers] = {
            ...users[findUsers],
            name,
            phone,
        }
        // - Tiến hành update
        fs.writeFileSync("./database/users.json" , JSON.stringify(users));
    }
    // - res về message update thành công
    res.json({
        message: "create user successfully",
      });
  } catch (error) {
    res.json({
        error,
      });
  }
});

server.delete("/users/:id" , (req,res) => {
    const {id} = req.params
    try {
        let users = JSON.parse(fs.readFileSync("./database/users.json"));
        let findUsers = users.findIndex((e) => e.id === +id);
        if(!findUsers) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            users.splice(findUsers, 1);
            fs.writeFileSync('./database/users.json', JSON.stringify(users));

            return res.json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

// Cài đặt cho server luôn luôn chờ đợi và lắng nghe
// Các request gửi lên từ client
server.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
