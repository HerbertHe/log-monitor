const Month = [
    ["January", "01"],
    ["February", "02"],
    ["March", "03"],
    ["April", "04"],
    ["May", "05"],
    ["June", "06"],
    ["July", "07"],
    ["August", "08"],
    ["September", "09"],
    ["October", "10"],
    ["November", "11"],
    ["December", "12"],
]

/**
 * 时间转化函数
 * @param time nginx时间
 */
export const nginxTimeConverter = (time: string) => {
    const regex =
        /([0-9]{1,2})\/([A-Za-z]+)\/([0-9]{1,4}):([0-9]{2}:[0-9]{2}:[0-9]{2})\s*([\+\-0-9]+)/
    const res = regex.exec(time)
    if (!!res) {
        let month = ""
        for (let i = 0; i < Month.length; i++) {
            if (Month[i][0] === res[2]) {
                month = Month[i][1]
                break
            }
        }

        return new Date(`${res[3]}-${month}-${res[1]}T${res[4]}${res[5]}`)
    } else {
        return null
    }
}
