var a=1
console.log('this is in coba plugin'+a)
a=a+1

function tambahA(){
    console.log(a)
    a=a+1
    return a
}

export default({app},inject)=>{
    inject('tambahA',tambahA)
}