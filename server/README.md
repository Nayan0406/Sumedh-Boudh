# TARS Backend Server

## Vercel Deployment Instructions

### Environment Variables
Set these environment variables in your Vercel dashboard:

```
MONGO_URI=mongodb+srv://nayan:nayan04@cluster0.lre5h1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CLOUDINARY_CLOUD_NAME=dcid3emdo
CLOUDINARY_API_KEY=672365289884774
CLOUDINARY_API_SECRET=fFM1Zdwl5gx69wJShUPmo4JHxX4
```

### Deployment Steps
1. Push this server folder to GitHub
2. Connect the repo to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy

### API Endpoints
- GET `/blog` - Get all blogs
- GET `/blog/:id` - Get single blog
- POST `/blog` - Create new blog
- POST `/login` - User login
- POST `/register` - User registration
- GET `/contact` - Get contact messages
- POST `/contact` - Submit contact form
- GET `/product` - Get all products
- POST `/product` - Create new product

### Local Development
```bash
npm install
npm run dev
```

Server will run on http://localhost:5000
