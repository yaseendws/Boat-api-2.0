const listenSocket = (io,socket)=>{
  
    socket.on('message', (data) => {
        console.log(data);
        io.emit(data.body);
      });
}
export {listenSocket}