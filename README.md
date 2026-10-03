# Truth Compass

# Fake News Detection System - AI-Powered Analysis Platform

## Project Overview
Create a comprehensive fake news detection website that uses machine learning models (Multinomial Naive Bayes and Logistic Regression) with TF-IDF vectorization to analyze news authenticity. The system should provide percentage-based truth scores, background verification from multiple sources, real-time updates across all news categories, and transparent explanations for classifications.

## Core Technical Requirements

### 1. Machine Learning Pipeline
```
- Implement TF-IDF vectorization on preprocessed text data
- Train and deploy two parallel models:
  * Multinomial Naive Bayes classifier
  * Logistic Regression classifier
- Ensemble voting system combining both model outputs
- Probability calibration for percentage-based truth scores
```

### 2. Real-Time Data Infrastructure
```
- Background news aggregator fetching from:
  * Official news websites (AP, Reuters, BBC, etc.)
  * Government and diplomatic sources
  * Verified fact-checking databases (Snopes, Politifact)
  * Local and regional news outlets
  * Sports, obituary, and specialized news sources
  
- Continuous update system with:
  * Scheduled hourly crawls for breaking news
  * Webhook-based real-time alerts for major events
  * RSS feed monitoring across 500+ verified sources
  * Historical news database for temporal verification
```

### 3. User Interface Components

**Input Methods (Three Options):**
```
1. Text Input Box: "Type/Paste News Content Here"
   - Character limit: 10,000 characters
   - Real-time length indicator

2. URL Analyzer: "Paste News Article URL"
   - Automatic webpage scraping
   - Metadata extraction (publisher, date, author)
   - Main content isolation from ads/navigation

3. File Upload: "Upload Text/Image/PDF"
   - OCR capability for image-based news
   - PDF text extraction
   - Multiple file support
```

**Output Dashboard:**
```
- Overall Truth Score: 87% TRUE / 13% FALSE
- Confidence Level: High/Medium/Low
- Visual probability meter (0-100% scale)

- Model-Specific Breakdown:
  * Multinomial Naive Bayes: 85% true probability
  * Logistic Regression: 89% true probability
  * Ensemble Final Score: 87%

- Key Factors Influencing Decision:
  ✓ Source credibility score: 92/100
  ✓ Cross-verification with 8 independent sources
  ✓ Statement matches official records
  ✗ Minor inconsistencies in date reporting
  ✓ Author has high trust rating

- Source Verification Panel:
  * List of 10+ consulted sources
  * Links to original verification articles
  * Publication dates and credibility scores
  * Direct quotes supporting/contradicting claim

- Background Check Results:
  * Publisher history analysis
  * Author verification status
  * Domain age and reputation
  * Historical accuracy rate
```

### 4. Verification Engine Details

**Multi-Layer Verification:**
```
Layer 1: Source Authentication
- SSL certificate validation
- Domain registration history
- Alexa/SimilarWeb traffic rankings
- Social media presence verification

Layer 2: Content Analysis
- Named Entity Recognition (persons, organizations, locations)
- Date consistency checking
- Statistical claim verification
- Image reverse search capability

Layer 3: Cross-Referencing
- Query expansion for similar claims
- Semantic similarity with trusted sources
- Temporal proximity analysis
- Geographic consistency check

Layer 4: Network Analysis
- Citation graph of supporting sources
- Authority weighting based on PageRank-like algorithm
- Bot detection in social amplification
```

### 5. Transparency Features

**"Why This Result?" Section:**
```
- Highlight specific phrases triggering classification
- Show similar verified/declared false stories
- Provide source conflict matrix
- Display temporal analysis timeline

**Model Explainability:**
- Top 10 TF-IDF features contributing to decision
- Feature importance comparison between models
- Confidence interval visualization
- Historical performance metrics
```

### 6. Technical Stack Recommendation

```
Backend:
- Python with Flask/Django
- Scikit-learn for ML models
- NLTK/SpaCy for NLP
- Celery for background tasks
- Redis for caching
- PostgreSQL for news database

Data Collection:
- BeautifulSoup/Scrapy for web scraping
- Newspaper3k for article extraction
- Google/NewsAPI integration
- Custom RSS parser

Frontend:
- React/Vue.js with responsive design
- Chart.js/D3.js for visualizations
- Real-time updates via WebSockets
- Progressive Web App capabilities

Infrastructure:
- Docker containerization
- Cloud deployment (AWS/GCP/Azure)
- CDN for static resources
- Load balancer for high traffic
```

### 7. Database Schema

```
Tables needed:
- articles (original submissions)
- sources (verified news outlets)
- verifications (cross-reference results)
- model_predictions (ML outputs)
- user_history (search logs)
- fact_checks (verified claims database)
- news_categories (topic classification)
```

### 8. Additional Features

```
- Browser extension for on-page analysis
- API access for developers
- Mobile applications (iOS/Android)
- Daily digest of popular claims analyzed
- Educational resources on media literacy
- Report system for disputed results
- Multi-language support (initial: English, Spanish, French)
```

### 9. Ethical Considerations

```
- Bias detection in training data
- Fairness across political spectrums
- Transparency in methodology
- Privacy protection for users
- No personal data retention policy
- Regular third-party audits
```

### 10. Success Metrics

```
- Accuracy: >95% on benchmark datasets
- Speed: <10 seconds for most analyses
- Coverage: 50,000+ sources monitored
- Uptime: 99.9% availability
- User satisfaction: >4.5/5 rating
```

## Prompt for AI/Development Team:

"Create a comprehensive fake news detection web application that implements Multinomial Naive Bayes and Logistic Regression classifiers with TF-IDF vectorization. The system must provide percentage-based truth scores, perform real-time background verification against continuously updated news databases, and offer three input methods (text, URL, copy-paste). Include transparent explanations for classifications, source attribution, and maintain background updates across all news categories (world, diplomatic, conflicts, sports, obituaries, local). Ensure the interface shows model-specific breakdowns, verification sources, and confidence metrics while handling high traffic with enterprise-grade reliability."

---

**Note:** This system requires significant computational resources for real-time verification and continuous updates. Consider starting with a focused geographical region or topic area before expanding globally. Regular model retraining with new data is essential for maintaining accuracy as news patterns evolve.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5249523b-d82f-4aaf-80bc-a6a9bfa0b221).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
