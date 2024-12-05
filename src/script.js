class Individual{
    constructor(id){
        this.id = id;
        this.connections = [];
        this.receivedMessage = "";
        this.verifiedMessage = false;
        this.publicKeys = {1: [], 2: [], 3: []}; //keep public keys of all individuals
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

        //Adds padding to final entry in noteBytes array if final entry is != 16 bytes in length
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

    //Uses the RSA algorithm to encrypt a signature
    //Returns encrypted signature
    encrypt(signature, num){

    }

    //Reverses encryption
    decrypt(signature){

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
            let sig = this.decrypt(message.signature);
            if(sig === this.encrypt(this.sign(message.info), this.id)){ //Decrypts and re-encrypts the signature with own public key to see if they match
                this.verifiedMessage = true;
            }
        }
    }
}


let alice = new Individual(1);
let jane = new Individual(2);
let bob = new Individual(3);

alice.addConnection(jane);
jane.addConnection(alice);
jane.addConnection(bob);
bob.addConnection(jane);


