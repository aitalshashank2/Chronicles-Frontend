import axios from 'axios'

export default class UploadAdapter{
    constructor(loader, randIdentifier) {
        this.loader = loader
        this.randIdentifier = randIdentifier
    }
    upload(){
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            const data = new FormData()
            data.append('randIdentifier', this.randIdentifier)
            data.append('url', file)
            axios.post('/images/', data).then(res => {
                console.log(res)
                var resData = res.data
                resData.default = resData.url
                resolve(resData)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        }))
    }
    abort(){
        //Reject promise
    }
}