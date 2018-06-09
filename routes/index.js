const express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home', {
    title: 'World Cup Ethereum Betting',
    breadcrumb: '',
    socketURL: process.env.API_BASE_URL,
    ropstenProvider: typeof process.env.ROPSTEN_PROVIDER !== 'undefined' ? process.env.ROPSTEN_PROVIDER : ''
  });
});

router.get('/faq', (req, res, next) => {
  res.render('faq', {
    title: 'FAQ',
    breadcrumb: 'FAQ'
  });
});

router.get('/how-it-works', (req, res, next) => {
  res.render('how_it_works', {
    title: 'How it works',
    breadcrumb: 'How it works'
  });
});

router.get('/airdrop', (req, res, next) => {
  res.render('airdrop', {
    title: 'Register for Airdrop',
    breadcrumb: 'Airdrop'
  });
});

module.exports = router;
