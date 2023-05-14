const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

//req - request (Một đối tượng mô tả về tất car những gì client request lên)
//res - response (Một đối tượng mô tả về tất cả các phương thức có thể response gửi về pjias client)

const server = http.createServer((req, res) => {
    // console.log(req.url);
    if(req.url === "/trang-chu"){
        let indexTemplates = fs.readFileSync("./templates/index.html");
        // console.log(indexTemplates.toString());
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(indexTemplates.toString())
    } else if(req.url === "/trang-con"){
  res.statusCode = 200;
  res.setHeader('Content-Type', "text/html; charset=utf-8");
  res.end(`<h1>Đây là trang con</h1>`);
} else{
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<h1>PAGE NOT FOUND</h1>`);
}
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

