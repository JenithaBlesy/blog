const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');

const app = express();

// ------------------------------
// ✅ Connect to MongoDB
// ------------------------------
mongoose.connect('mongodb://127.0.0.1:27017/BlogWebsiteDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ------------------------------
// ✅ Set EJS as the template engine
// ------------------------------
app.set('view engine', 'ejs');

// ------------------------------
// ✅ Middleware setup
// ------------------------------
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// ------------------------------
// ✅ Home Route - Search & Display Articles
// ------------------------------
app.get('/', async (req, res) => {
    try {
        const { query } = req.query; 
        let articles;

        if (query) {
            // Search in title and description (case-insensitive)
            articles = await Article.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }).sort({ createdAt: 'desc' });
        } else {
            // Fetch all articles if no search query
            articles = await Article.find().sort({ createdAt: 'desc' });
        }

        const message = articles.length === 0 ? 'No articles found.' : null;
        res.render('articles/index', { articles, message });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).send('Internal Server Error');
    }
});

// ------------------------------
// ✅ Use Article Routes
// ------------------------------
app.use('/articles', articleRouter);

// ------------------------------
// ✅ Start Server
// ------------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
