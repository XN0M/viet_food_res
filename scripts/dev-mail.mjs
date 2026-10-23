// Minimal loopback-only SMTP sink for local tests when Docker Mailpit is unavailable.
import net from 'node:net';
import http from 'node:http';
const messages=[];
net.createServer(socket=>{
 socket.write('220 localhost test SMTP\r\n');let buffer='',data=false,mail=[];
 socket.on('data',chunk=>{buffer+=chunk.toString();let index;while((index=buffer.indexOf('\r\n'))>=0){const line=buffer.slice(0,index);buffer=buffer.slice(index+2);if(data){if(line==='.'){messages.push({at:new Date().toISOString(),raw:mail.join('\r\n')});if(messages.length>100)messages.shift();mail=[];data=false;socket.write('250 accepted for local testing\r\n');}else mail.push(line);continue;}if(/^EHLO|^HELO/.test(line))socket.write('250 localhost\r\n');else if(/^DATA/.test(line)){data=true;socket.write('354 end with dot\r\n');}else if(/^QUIT/.test(line)){socket.end('221 bye\r\n');}else socket.write('250 ok\r\n');}});
}).listen(1028,'127.0.0.1');
http.createServer((req,res)=>{res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(JSON.stringify({messages},null,2));}).listen(8028,'127.0.0.1',()=>console.log('Local SMTP sink: 127.0.0.1:1028; test messages: http://127.0.0.1:8028'));
