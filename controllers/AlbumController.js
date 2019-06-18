let album = require("../models/album.js");
let async = require("async");

album.constructAlbum();

module.exports.gotoDebut = function (request, response) {
    request.session.debutAlbum = 0;
    request.session.debutMiniAlbum = 0;

    album.afficherAlbum(0, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        response.photos = result;
        response.debutAlbumPhoto = 0;

        response.render('listerAlbum', response);
    });

};

module.exports.gotoPrecedent = function (request, response) {

    let debutAlbumPhoto = request.session.debutAlbum - 12;
    request.session.debutAlbum = debutAlbumPhoto;

    album.afficherAlbum(debutAlbumPhoto, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.photos = result;
        response.debutAlbumPhoto = debutAlbumPhoto;
        response.render('listerAlbum', response);
    });
};

module.exports.gotoSuivant = function (request, response) {

    let debutAlbumPhoto = request.session.debutAlbum + 12;
    request.session.debutAlbum = debutAlbumPhoto;

    async.parallel(
        [
            function (callback) {
                album.afficherAlbum(debutAlbumPhoto, function (err, result) {
                    callback(null, result);
                });
            },
            function (callback) {
                album.getNbPhotos(function (err, result) {
                    callback(null, result);
                });
            }

        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.photos = result[0];

            if ((result[1][0].nbPhoto - debutAlbumPhoto) > 12) {
                response.debutAlbumPhoto = debutAlbumPhoto;
            } else {
                response.debutAlbumPhoto = "fin";
            }

            response.render('listerAlbum', response);
        }
    );

};

module.exports.gotoFin = function (request, response) {
    album.getNbPhotos(function (err, nbPhoto) {

        let debutAlbumPhoto = nbPhoto[0].nbPhoto - (nbPhoto[0].nbPhoto % 12);
        request.session.debutAlbum = debutAlbumPhoto;

        album.afficherAlbum(debutAlbumPhoto, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            response.photos = result;
            response.debutAlbumPhoto = 'fin';

            response.render('listerAlbum', response);

        });
    });
};


module.exports.DetailPhotoSuivanteVip = function (request, response) {
    request.params.numPhoto = parseInt(request.params.numPhoto) + 1;
    module.exports.DetailPhotoVip(request, response);
};

module.exports.DetailPhotoPrecedenteVip = function (request, response) {
    request.params.numPhoto = parseInt(request.params.numPhoto) - 1;
    module.exports.DetailPhotoVip(request, response);
};

module.exports.DetailPhotoVip = function (request, response) {
    let idVip = request.params.idVip;

    if (request.params.numPhoto === undefined) {
        numPhoto = 0;
    } else {
        numPhoto = request.params.numPhoto;
    }

    async.parallel(
        [
            function (callback) {
                album.afficherAlbum(request.session.debutAlbum, function (err, result) {
                    callback(null, result);
                });
            },
            function (callback) {
                album.getPhotosOfAVip(idVip, function (err, result) {
                    callback(null, result);
                });
            },
            function (callback) {
                album.getNbPhotosOfAVip(idVip, function (err, result) {
                    callback(null, result);
                });
            }

        ],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            if (numPhoto !== 0) {
                response.hasPrecedent = true;
            }

            if (numPhoto < result[2][0].nbPhoto - 1) {
                response.hasNext = true;
            }

            response.photos = result[0];
            response.photoOfAVip = result[1][numPhoto];
            response.idVip = idVip;
            response.numPhoto = numPhoto;

            response.render('listerAlbum', response);
        }
    );

};

