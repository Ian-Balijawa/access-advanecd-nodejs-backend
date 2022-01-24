module.exports = { 
  db: {
    master: `mongodb://localhost/obiviadbserver`,
    options: { auto_reconnect: true, reconnectTries: Number.MAX_SAFE_INTEGER, poolSize: 100, useCreateIndex: true,useUnifiedTopology: true,useNewUrlParser: true, readPreference: "primaryPreferred" }
    }, 
    appSecret: "myapisecretjsdfsjkdfjkdsfuwyertuewfjdscsbcmnsbvdsmnfbdmnsbfmndsuyewruyewtuydsbfdshjfgdsfgdjsvmnbvbcxxmnvbvjkmnvbcxmbvcmxbvbxcmnveriugtiuritunvndfbvjdfbvbhjvbfnbvjdfgfbvjbdf",
    cookieKey: '123123123',
    port: 5000, 
};
