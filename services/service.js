import http from './http'

class DataService{



createLoad(data){

    return http.post('/createLoad',data)

}

getLoads(){

    return http.get('/getLoads')
}

getLoadOriginDestination(data){

    return http.post('/getLoadOriginDestination',data)
}

}


export default new DataService();