module.exports = {
  db: {
    master: `mongodb://localhost/access-advanced`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  appSecret:
    'myapisecretjsdfsjkdfjkdsfuwyertuewfjdscsbcmnsbvdsmnfbdmnsbfmndsuyewruyewtuydsbfdshjfgdsfgdjsvmnbvbcxxmnvbvjkmnvbcxmbvcmxbvbxcmnveriugtiuritunvndfbvjdfbvbhjvbfnbvjdfgfbvjbdf',
  cookieKey: '123123123',
  port: 5000,
};
