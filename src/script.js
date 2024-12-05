class Individual{
    constructor(id, key){
        this.id = id;
        this.connections = [];
        this.receivedMessage = null;
        this.verifiedMessage = false;
        this.publicKeys = {"alice": [5, 323], "jane": [5, 299], "bob": [3, 319]}; //keep public keys of all individuals
        this.privateKey = key; 
    }

    addConnection(node){
        this.connections.push(node);
    }

    //Uses the simplified SHA algorithm to create a signature
    //Returns signature
    sign(note){
        let signature = null;
        let noteBytes = [];
        let word = "";

        //1 char = 1 byte
        for(let i = 1; i <= note.length; i++){
            if(i % 16 === 0){
                noteBytes.push(word);
                word = "";
            }
            word = word + "" + note.charAt(i - 1);
        }
        if(word.length > 0) noteBytes.push(word);

        //Adds padding to final entry in noteBytes array if final entry is < 16 bytes in length
        let final = noteBytes[noteBytes.length - 1];
        if(final.length != 16){
            for(let i = final.length - 1; i < 16; i++){
                noteBytes[noteBytes.length - 1] = noteBytes[noteBytes.length - 1] + "0";
            }
        }

        //xor's every string in noteBytes array with one another to generate unique 16 bit signature
        signature = noteBytes[0];
        for(let i = 0; i < noteBytes.length; i++){
            signature = xorStrings(signature, noteBytes[i]);
        }

        return signature;
    }
    xorStrings(string1, string2){ //Helper method for SHA algorithm
        let res = "";

        for(let i = 0; i < string1.length; i++){ //both strings are the same length
            let c1 = string1.charCodeAt(i);
            let c2 = string2.charCodeAt(i);
            let xc = c1 ^ c2;
            res += String.fromCharCode(xc);
        }

        return res;
    }

    //Uses the RSA algorithm to encrypt a signature using the target recipient's public key
    //Returns encrypted signature
    encrypt(signature, num){
        let keys;
        let sigArray = signature.split("");
        let enSig = "";

        switch(num){
            case 1: keys = publicKeys.alice; break;
            case 2: keys = publicKeys.jane; break;
            case 3: keys = publicKeys.bob; break;
        }

        for(let i = 0; i < sigArray.length; i++){
            let ccode = Number( BigInt( BigInt(sigArray[i].charCodeAt(0)) ** BigInt(keys[0])) % BigInt(keys[1])); //The use of BigInt is necessary to process potentially massive exponents
            enSig = enSig + "" + String.fromCharCode(ccode);
        }

        return enSig;
    }

    //Reverses encryption using private key
    decrypt(signature){
        let keys = this.privateKey;
        let sigArray = signature.split("");
        let deSig = "";
    
        for(let i = 0; i < sigArray.length; i++){
            let ccode = Number( BigInt( BigInt(sigArray[i].charCodeAt(0)) ** BigInt(keys[0])) % BigInt(keys[1]));
            deSig = deSig + "" + String.fromCharCode(ccode);
        }

        return deSig;
    }

    create(note, num){
        let message = {id: num, info: note, signature: null};
        message.signature = this.encrypt(this.sign(message.info), num);
        this.send(message, this.id);
    }

    send(message, id){
        for(connection in connections){ //Ensures that the message does not get sent back to the person who already sent it in the first place
            if(connection.id != id) connection.receive(message);
        }
    }

    receive(message){
        if(message.id != this.id){
            this.send(message, this.id);
        }
        else{
            this.receivedMessage = message;
            let sig = this.decrypt(message.signature);
            if(sig === this.sign(message.info)){ //Decrypts and reconstructs the signature using the message to see if they match
                this.verifiedMessage = true;
            }
        }
    }
}

//The math for these keys were done via keygen
let alice = new Individual(1, [173, 323]);
let jane = new Individual(2, [53, 299]);
let bob = new Individual(3, [187, 319]);

alice.addConnection(jane);
jane.addConnection(alice);
jane.addConnection(bob);
bob.addConnection(jane);

alice.create("hello", 2);
console.log(bob.verifiedMessage);
