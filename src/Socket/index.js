const listenSocket = (io,socket)=>{
  
    socket.on('message', (data) => {
        console.log(data);
        io.emit(data.body);
      });
      socket.on('private_message', data => {
        socket.to(data.targetUserId).emit('private_message', data.message);
        console.log(data.targetUserId)
      });
}
export {listenSocket}

