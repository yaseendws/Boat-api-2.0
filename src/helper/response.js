import errList from "./errList.js"

const responseHandler = (res,data) =>{
    res.status(200)
    res.json(data)
}
const errHandler = (res,err,status) =>{
    console.log(typeof err)
    if(typeof err=="string"){
        throw new err
        res.json({err})
    }else{
        throw new err
        res.json({err:errList[err]})
    }
    res.status(status)
}

export {responseHandler,errHandler}