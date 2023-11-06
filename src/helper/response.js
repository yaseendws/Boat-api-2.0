import errList from "./errList.js"

const responseHandler = (res,data) =>{
    res.status(200)
    res.json(data)
}
const errHandler = (res,err,status) =>{
    console.log(typeof err)
    res.status(status)
    if(typeof err=="string"){
        res.json({err})
        throw new err
    }else{
        res.json({err:errList[err]})
        throw new errList[err]
    }
}

export {responseHandler,errHandler}