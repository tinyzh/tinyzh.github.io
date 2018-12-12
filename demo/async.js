async function name(params) {
    // let res = await calc(9999)
    // console.log(res)
    console.log('start')
    await sleep(2000)
    console.log('end')
}
function calc(nums) {
    if(nums > 0){
        return nums + calc(nums - 1)
    }else{
        return 0
    }
}
function sleep(milliseconds){
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
sleep(5000).then(() => {
    console.log('xxx')
})
name()
