let HomeController = require('./../controllers/HomeController');
let VipController = require('./../controllers/VipController');
let AlbumController = require('./../controllers/AlbumController');
let ArticleController = require('./../controllers/ArticleController');

// Routes
module.exports = function (app) {

    // Main Routes
    app.get('/', HomeController.Index);
    app.get('/accueil', HomeController.Index);

    // VIP
    app.get('/repertoire', VipController.Repertoire);
    app.get('/repertoire/:lettre', VipController.DetailleLettre);
    app.get('/repertoire/vip/:idVip', VipController.DetailleVip);

    // albums
    app.get('/album', AlbumController.gotoDebut);
    app.get('/album/detail/:idVip', AlbumController.DetailPhotoVip);
    app.get('/album/detail/:idVip/suivant/:numPhoto', AlbumController.DetailPhotoSuivanteVip);
    app.get('/album/detail/:idVip/precedent/:numPhoto', AlbumController.DetailPhotoPrecedenteVip);
    app.get('/album/debut', AlbumController.gotoDebut);
    app.get('/album/precedent', AlbumController.gotoPrecedent);
    app.get('/album/suivant', AlbumController.gotoSuivant);
    app.get('/album/fin', AlbumController.gotoFin);

    // article
    app.get('/articles', ArticleController.ListerVIP);
    app.get('/articles/vip/:idVip', ArticleController.ArticleVIP);

    // tout le reste
    app.get('*', HomeController.NotFound);
    app.post('*', HomeController.NotFound);

};
