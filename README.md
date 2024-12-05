# encrypted-signature

For ICS 311

This program simulates a simple 3 node graph of 3 individuals, each with the ability to send a message with an encrypted hash signature to one another.

![image](https://github.com/user-attachments/assets/ba9b4c76-2eed-42f7-ae68-45d28512da4f)

In order to prove this program worked, all of the above lines of code must resolve to true, as it means that the target individual of the message had received it, decrypted the signature, re-hashed the message, and determined the re-hashed message to match the signature. This in turn means that the implemented nodes, message sharing and receiving functions, message creating function, SHA hash function, and RSA encryption function all work as intended.


And, it does.

![image](https://github.com/user-attachments/assets/e77b8e05-d723-49a3-9771-18b7f7fe884c)


This code was tested using the Programiz website's online JavaScript  compiler.
