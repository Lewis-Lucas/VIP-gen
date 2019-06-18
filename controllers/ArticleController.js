let model = require("../models/article.js");
let async = require("async");

module.exports.ListerVIP = function (request, response) {
    response.title = 'Choix VIP';

    model.getListeVIP(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.VIP = result;
        response.render('listerArticle', response);
    });
};

module.exports.ArticleVIP = function (request, response) {
    response.title = 'Article VIP';
    let idVip = request.params.idVip;

    async.parallel(
        [
            function (callback) {
                model.getArticleVIP(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getListeVIP(function (err, result) {
                    callback(null, result)
                });
            }
        ],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.article = result[0];
            response.VIP = result[1];
            response.render('listerArticle', response);
        }
    );
};

