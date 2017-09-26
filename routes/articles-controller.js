import Router from '../extensions/router';

import Article from '../models/article';

export default class ArticlesController extends Router {
    get root() {
        return '/articles';
    }

    get routes() {
        return [
            ['get', '/', this.actionGetAllArticles],
            ['get', '/:id', this.actionGetArticleById],
            ['put', '/', this.actionCreateArticle],
            ['post', '/:id', this.actionUpdateArticleById],
            ['delete', '/:id', this.actionDeleteArticleById],
        ];
    }

    async actionGetAllArticles(req, res) {
        try {
            const articles = await Article.find({})
                .populate('author', '_id username email')
                .exec();

            res.json({
                articles,
                message: 'Get all articles'
            });
        }
        catch (err) {
            res.json({
                error: err,
                message: 'Error Get all articles'
            });
        }
    }

    async actionGetArticleById(req, res) {
        try {
            const article = await Article.findById(req.params.id)
                .populate('author', '_id username email')
                .exec();

            res.json({
                article,
                message: 'Get article by id'
            });
        }
        catch (err) {
            res.json({
                error: err,
                message: 'Error Get article by id'
            });
        }
    }

    async actionCreateArticle(req, res) {
        try {
            const article = await new Article({
                author: req.body.author,
                title: req.body.title,
                description: req.body.description,
            }).save();

            res.json({
                article,
                message: 'Create new article'
            });
        }
        catch (err) {
            res.json({
                error: err.errors || err,
                message: 'Error Create new article'
            });
        }
    }

    async actionUpdateArticleById(req, res) {
        try {
            const article = await Article.findById(req.params.id);

            article.author = req.body.author;
            article.title = req.body.title;
            article.description = req.body.description;

            const updateArticle = await article.save();

            res.json({
                article: updateArticle,
                message: 'Update article by id: ' + req.params.id
            });
        }
        catch (err) {
            res.json({
                error: err.errors || err,
                message: 'Error update article by id ' + req.params.id
            });
        }
    }

    async actionDeleteArticleById (req, res) {
        try {
            const affected = await Article.remove({
                _id: req.params.id
            });

            res.json({
                affected,
                message: 'Delete article by id' + req.params.id
            });
        }
        catch (err) {
            res.json({
               error: err.errors || err,
               message: 'Error Delete article by id ' + req.params.id
            });
        }
    }
}
