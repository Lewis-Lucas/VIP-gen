let db = require('../configDb');

module.exports.getListeVIP = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT `VIP_NUMERO` as idVip, `VIP_PRENOM` as prenom, `VIP_NOM` as nom FROM `vip` ORDER BY `VIP_NOM`";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

module.exports.getArticleVIP = function (idVip, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            let sql = "SELECT " +
                "aps.`VIP_NUMERO` as idVip, " +
                "v.`VIP_NOM` as nom, " +
                "v.`VIP_PRENOM` as prenom, " +
                "a.`ARTICLE_TITRE` as titreArticle, " +
                "a.`ARTICLE_RESUME` as article, " +
                "p.`PHOTO_ADRESSE` as imageArticle, " +
                "a.`ARTICLE_DATE_INSERT` as dateArticle " +
                "FROM `article` a " +
                "INNER JOIN `apoursujet` aps ON a.`ARTICLE_NUMERO` = aps.`ARTICLE_NUMERO` " +
                "INNER JOIN `vip` v ON v.`VIP_NUMERO` = aps.`VIP_NUMERO` " +
                "LEFT JOIN `comporte` c ON c.`ARTICLE_NUMERO` = a.`ARTICLE_NUMERO` " +
                "LEFT JOIN `photo` p ON p.`VIP_NUMERO` = c.`VIP_NUMERO` " +
                "WHERE aps.`VIP_NUMERO` = " + idVip;
            connexion.query(sql, callback);
            console.log(sql);
            connexion.release();
        }
    });
};
