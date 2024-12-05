//Not connected to the rest of the graph, but this code is what I used to generate the public and private keys for RSA

//==INITIAL PRIME VALUES==
let p = 17; //p and q are both prime numbers that can be chosen arbitrarily
let q = 29;
//========================


//==DETERMINED VALUES==
let N = p*q;
let phiN = (p - 1)*(q - 1); //phi function
let e = 0;
let d = 0;
//=====================


//==PUBLIC KEY GENERATOR==
function gcd(a, b) { //determines the greatest common factor, which helps to determine if a number is coprime in order to choose a value for e
    let maxDivisor = 1;
    let len = Math.min(a, b);
    for(let i = 1; i <= len; i++){
        if((a % i === 0) && (b % i === 0)){
            if(i > maxDivisor) maxDivisor = i;
        }
    }
    return maxDivisor;
}

for(let i = 2; i < phiN; i++){ //determines e
    if((gcd(i, N) === gcd(i, phiN)) && (gcd(i, N) === 1)){
        e = i;
        break;
    }
}

console.log("Public key: [" + e + ", " + N + "]"); //Logs public key
//========================


//==PRIVATE KEY GENERATOR==
d = e + 1; //Through testing, the public and private keys end up exactly the same without this line

while(((d*e)%phiN) != 1){
    d+=1;
}

console.log("Private key: [" + d + ", " + N + "]"); //Logs private key
//=========================


//==KEY TESTING==
let message = 256;
let encryptedMessage = Number( BigInt( BigInt(message) ** BigInt(e)) % BigInt(N));
let decryptedMessage = Number( BigInt( BigInt(encryptedMessage) ** BigInt(d)) % BigInt(N));
console.log(message === decryptedMessage); //Must return true
//===============