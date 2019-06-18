let db = require('../configDb');
let async = require("async");

module.exports.getAlphabet = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT DISTINCT LEFT(vip_nom,1) AS lettre FROM `vip` order by lettre";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


module.exports.getStarsCorrespondingToALetter = function (lettre, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT vip_nom AS nom , vip_prenom AS prenom, v.vip_numero AS numero, p.PHOTO_ADRESSE AS photo FROM vip v INNER JOIN photo p ON p.vip_numero = v.vip_numero WHERE Left(vip_nom,1)  = '" + lettre + "' and photo_numero = 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


module.exports.getDetailsStars = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_NUMERO AS numero, VIP_NOM AS nom, VIP_PRENOM AS prenom, VIP_NAISSANCE AS dateNaissance, VIP_TEXTE AS quiSuisJe FROM vip WHERE vip_numero = '" + id + "'";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getSexe = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_SEXE AS sexe FROM vip WHERE vip_numero = '" + id + "'";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPhotoPrincipale = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT p.PHOTO_ADRESSE AS photo FROM vip v INNER JOIN photo p ON p.vip_numero = v.vip_numero WHERE v.vip_numero  = '" + id + "' and photo_numero = 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getNationalite = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT NATIONALITE_NOM AS nationalite FROM nationalite n INNER JOIN vip v ON v.nationalite_numero = n.nationalite_numero WHERE vip_numero = '" + id + "'";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPrincipauxFilmsActeur = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "film_titre AS titre, " +
                "vr.VIP_NUMERO AS idVip, " +
                "vr.vip_prenom AS prenom, " +
                "vr.vip_nom AS nom, " +
                "SUBSTR(vr.vip_texte, 1, 200) AS quiSuisJe, " +
                "p.PHOTO_ADRESSE AS photo " +
                "FROM vip va " +
                "INNER JOIN acteur a ON a.VIP_NUMERO = va.VIP_NUMERO " +
                "INNER JOIN joue j ON a.VIP_NUMERO = j.VIP_NUMERO " +
                "INNER JOIN film f ON j.FILM_NUMERO = f.film_NUMERO " +
                "LEFT JOIN realisateur r ON f.VIP_NUMERO = r.VIP_NUMERO " +
                "LEFT JOIN vip vr ON r.VIP_NUMERO = vr.VIP_NUMERO  " +
                "INNER JOIN photo p ON p.VIP_NUMERO = vr.VIP_NUMERO " +
                "WHERE va.VIP_NUMERO =  " + id + " AND photo_numero = 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPrincipauxFilmsRealisateur = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT film_titre AS titre FROM film WHERE VIP_NUMERO =  " + id;
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPrincipauxDefile = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "DEFILE_LIEU AS lieuDefile, " +
                "DEFILE_DATE AS dateDefile, " +
                "vr.VIP_NUMERO AS idVip, " +
                "vr.vip_prenom AS prenom, " +
                "vr.vip_nom AS nom, " +
                "SUBSTR(vr.vip_texte, 1, 200) AS quiSuisJe, " +
                "p.PHOTO_ADRESSE AS photo F" +
                "ROM vip va " +
                "INNER JOIN defiledans dd ON dd.VIP_NUMERO = va.VIP_NUMERO " +
                "INNER JOIN defile d ON d.DEFILE_NUMERO = dd.DEFILE_NUMERO " +
                "LEFT JOIN vip vr ON d.VIP_NUMERO = vr.VIP_NUMERO " +
                "INNER JOIN photo p ON p.VIP_NUMERO = vr.VIP_NUMERO " +
                "WHERE va.VIP_NUMERO =  " + id + " AND photo_numero = 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPrincipauxAlbum = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT ALBUM_TITRE AS titreAlbum, ALBUM_DATE AS dateAlbum FROM vip v INNER JOIN composer c ON c.VIP_NUMERO = v.VIP_NUMERO INNER JOIN album a ON c.ALBUM_NUMERO = a.ALBUM_NUMERO WHERE v.VIP_NUMERO = " + id;
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.isMannequin = function (id, callback) {
    async.parallel(
        [function (callback) {
            db.getConnection(function (err, connexion) {
                if (!err) {
                    let sql = "SELECT COUNT(VIP_NUMERO) AS isMannequin FROM mannequin WHERE VIP_NUMERO =  '" + id + "'";
                    connexion.query(sql, callback);
                    connexion.release();
                }
            });
        }], function (err, result) {
            if (!err) {

                let nomProfession;

                if (result[0][0][0].isMannequin === 1) {
                    nomProfession = "Mannequin";
                }

                callback(null, nomProfession);
            }
        });

};

module.exports.isRealisateur = function (id, callback) {

    async.parallel(
        [function (callback) {
            db.getConnection(function (err, connexion) {
                if (!err) {
                    let sql = "SELECT COUNT(VIP_NUMERO) AS isRealisateur FROM realisateur WHERE VIP_NUMERO =  '" + id + "'";
                    connexion.query(sql, callback);
                    connexion.release();
                }
            })
        },
            function (callback) {
                module.exports.getSexe(id, function (err, result) {
                    callback(null, result)
                });
            }
        ], function (err, result) {
            if (!err) {

                let nomProfession;

                if (result[0][0][0].isRealisateur === 1) {
                    if (result[1][0].sexe === 'M') {
                        nomProfession = "Realisateur";
                    } else {
                        nomProfession = "Realisatrice";
                    }
                }

                callback(null, nomProfession);
            }
        });
};

module.exports.isActeur = function (id, callback) {

    async.parallel(
        [function (callback) {
            db.getConnection(function (err, connexion) {
                if (!err) {
                    let sql = "SELECT COUNT(VIP_NUMERO) AS isActeur FROM acteur WHERE VIP_NUMERO =  '" + id + "'";
                    connexion.query(sql, callback);
                    connexion.release();
                }
            })
        },
            function (callback) {
                module.exports.getSexe(id, function (err, result) {
                    callback(null, result)
                });
            }
        ], function (err, result) {
            if (!err) {

                let nomProfession;

                if (result[0][0][0].isActeur === 1) {
                    if (result[1][0].sexe === 'M') {
                        nomProfession = "Acteur";
                    } else {
                        nomProfession = "Actrice";
                    }
                }

                callback(null, nomProfession);
            }
        });
};

module.exports.isCouturier = function (id, callback) {

    async.parallel(
        [function (callback) {
            db.getConnection(function (err, connexion) {
                if (!err) {
                    let sql = "SELECT COUNT(VIP_NUMERO) AS isCouturier FROM couturier WHERE VIP_NUMERO =  '" + id + "'";
                    connexion.query(sql, callback);
                    connexion.release();
                }
            })
        },
            function (callback) {
                module.exports.getSexe(id, function (err, result) {
                    callback(null, result)
                });
            }
        ], function (err, result) {
            if (!err) {

                let nomProfession;

                if (result[0][0][0].isCouturier === 1) {
                    if (result[1][0].sexe === 'M') {
                        nomProfession = "Couturier";
                    } else {
                        nomProfession = "Couturière";
                    }
                }

                callback(null, nomProfession);
            }
        });
};

module.exports.isChanteur = function (id, callback) {

    async.parallel(
        [function (callback) {
            db.getConnection(function (err, connexion) {
                if (!err) {
                    let sql = "SELECT COUNT(VIP_NUMERO) AS isChanteur FROM chanteur WHERE VIP_NUMERO =  '" + id + "'";
                    connexion.query(sql, callback);
                    connexion.release();
                }
            })
        },
            function (callback) {
                module.exports.getSexe(id, function (err, result) {
                    callback(null, result)
                });
            }
        ], function (err, result) {
            if (!err) {

                let nomProfession;

                if (result[0][0][0].isChanteur === 1) {
                    if (result[1][0].sexe === 'M') {
                        nomProfession = "Chanteur";
                    } else {
                        nomProfession = "Chanteuse";
                    }
                }

                callback(null, nomProfession);
            }
        });
};

module.exports.getMariage = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "m.`VIP_VIP_NUMERO` as idVip, " +
                "v.VIP_NOM as nom, " +
                "v.VIP_PRENOM as prenom, " +
                "p.PHOTO_ADRESSE AS photo, " +
                "SUBSTR(v.vip_texte, 1, 200) AS quiSuisJe, " +
                "`DATE_EVENEMENT` as debutMariage, " +
                "`MARIAGE_LIEU` as lieuMariage, " +
                "`MARIAGE_FIN` as finMariage " +
                "FROM `mariage` m " +
                "INNER JOIN vip v ON m.`VIP_VIP_NUMERO` = v.`VIP_NUMERO` " +
                "INNER JOIN photo p ON p.VIP_NUMERO = m.`VIP_VIP_NUMERO` " +
                "WHERE m.`VIP_NUMERO` = " + id + " AND p.PHOTO_NUMERO = 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getLiaison = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "l.`VIP_VIP_NUMERO` as idVip, " +
                "v.VIP_NOM as nom, " +
                "v.VIP_PRENOM as prenom, " +
                "p.PHOTO_ADRESSE AS photo, " +
                "SUBSTR(v.vip_texte, 1, 200) AS quiSuisJe, " +
                "l.`DATE_EVENEMENT` as debutLiaison, " +
                "l.`LIAISON_MOTIFFIN` as raisonFinLiaison " +
                "FROM `liaison` l " +
                "INNER JOIN vip v ON l.`VIP_VIP_NUMERO` = v.`VIP_NUMERO` " +
                "INNER JOIN photo p ON p.VIP_NUMERO = l.`VIP_VIP_NUMERO` " +
                "WHERE l.`VIP_NUMERO` = " + id + " AND p.PHOTO_NUMERO = 1 ";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getPhotosVIP = function (id, callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "p.`PHOTO_ADRESSE` as photo, " +
                "p.`PHOTO_SUJET` as sujet, " +
                "(p.`PHOTO_NUMERO` - 1) as numPhoto, " +
                "p.`PHOTO_COMMENTAIRE` as description, " +
                "v.`VIP_NOM` as nom, " +
                "v.`VIP_PRENOM` as prenom " +
                "FROM `photo` p " +
                "INNER JOIN `vip` v ON p.`VIP_NUMERO` = v.`VIP_NUMERO` " +
                "WHERE p.`VIP_NUMERO` = " + id + " AND `PHOTO_NUMERO` != 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};
