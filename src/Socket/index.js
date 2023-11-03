const listenSocket = (io,socket)=>{
    socket.on('message', (data) => {
        console.log(data);
        io.emit('message', data.id);
      });
}
export {listenSocket}