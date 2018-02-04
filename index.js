const http = require("http");

module.exports = (userId, apiKey) => {
	if ( ! apiKey)
        apiKey="b84f6e48d7743ab4dc8ce41741da45dd"
        
	if ( ! userId)
        userId="4709858"
        
	this.short = (url, cb, retry) => {
        const URL = "http://api.adf.ly/v1/shorten"
        
        const data = `_user_id=${userId}&_api_key=${apiKey}&url=${url}`
        
		const options = {
			host: "api.adf.ly",
			port: 80,
			path: "/v1/shorten",
			method: "POST",
			headers: {
				"Content-Type" : "application/x-www-form-urlencoded",
				"Content-Length" : Buffer.byteLength(data)
			}
        }
        
		const req = http.request(options, (res) => {
            res.setEncoding("utf8")
            
            let body = ""
            
			res.on("data", (d) => {
				body += d
            })
            
			res.on("end", () =>{
				try {
					const json = JSON.parse(body)
					
					if (json.data && json.data.length && json.data[0].short_url)
						return cb(json.data[0].short_url)
				} catch(e) {
                    if ( ! retry) {
                        return this.short(url, cb, true)
                    }
					console.log('Error parsing JSON.', body)
                    cb(false, json)
				}
			})
        })
        
		req.write(data)
		req.end()
		
    }
    
	return this
}
