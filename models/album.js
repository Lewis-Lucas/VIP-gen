let db = require('../configDb');

let albumPhoto = [];
let albumPhotoOfAVip = [];

module.exports.getPhoto = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "`PHOTO_ADRESSE` as photo, " +
                "p.`VIP_NUMERO` as idVip " +
                "FROM `photo` p " +
                "INNER JOIN `vip` v ON p.`VIP_NUMERO` = v.`VIP_NUMERO`" +
                "WHERE `PHOTO_NUMERO` = 1 ORDER BY `VIP_NOM`";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


module.exports.getPhotosOfAVip = function (idVip, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "p.`PHOTO_ADRESSE` as photo, " +
                "p.`PHOTO_NUMERO` as numPhoto, " +
                "p.`PHOTO_COMMENTAIRE` as description, " +
                "v.`VIP_NOM` as nom, " +
                "v.`VIP_PRENOM` as prenom " +
                "FROM `photo` p " +
                "INNER JOIN `vip` v ON p.`VIP_NUMERO` = v.`VIP_NUMERO` " +
                "WHERE p.`VIP_NUMERO` = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getNbPhotosOfAVip = function (idVip, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT COUNT(`PHOTO_ADRESSE`) as nbPhoto FROM `photo` p WHERE `VIP_NUMERO` = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


module.exports.getNbPhotos = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT COUNT(`PHOTO_ADRESSE`) as nbPhoto FROM `photo` p WHERE `PHOTO_NUMERO` = 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


module.exports.constructAlbum = function () {
    module.exports.getPhoto(function (err, result) {

        if (err) {
            console.log(err);
            return;
        }

        for (let compteurPhoto = 0; compteurPhoto < result.length; compteurPhoto++) {
            albumPhoto.push(result[compteurPhoto]);
        }

    });
};

module.exports.afficherAlbum = function (debut, callback) {

    let photoAfficher = [];
    let i = debut;
    let nbPhoto = 0;

    while (i < albumPhoto.length && nbPhoto < 12) {
        photoAfficher.push(albumPhoto[i]);
        i++;
        nbPhoto++;
    }

    callback(null, photoAfficher);
};