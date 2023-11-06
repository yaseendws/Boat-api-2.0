import errList from "./errList.js"

const responseHandler = (res,data) =>{
    res.status(200)
    res.json(data)
}
const errHandler = (res,err,status) =>{
    console.log(typeof err)
    
    if(typeof err=="string"){
        res.status(status).send({
            message: err
         })
        // res.json({err})
    }else{
        res.status(status).send({
            message: errList[err]
         })
        // res.json({err:errList[err]})
    }
}

export {responseHandler,errHandler}