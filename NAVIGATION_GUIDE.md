# Navigation Guide - Two Page Variations

## 🌐 Application Structure

The application now has **two distinct pages** that you can navigate between:

### 1. **Dashboard Page** (`/`)
- **Route**: `/` (home page)
- **Purpose**: Main operational dashboard with real-time data
- **Features**:
  - Current field status (soil moisture, nutrients, weather)
  - AI recommendations panel (irrigation, fertilizer, pest risk)
  - Historical trend charts (30-day view)
  - Alert notifications
  - Yield forecast

### 2. **Analytics Page** (`/analytics`)
- **Route**: `/analytics`
- **Purpose**: Advanced analytics and detailed insights
- **Features**:
  - Key metrics summary (averages, confidence scores)
  - Comprehensive nutrient trend analysis
  - 7-day weather forecast visualization
  - Combined environmental factor charts
  - Yield history with bar charts
  - AI recommendations summary

## 🧭 How to Navigate

### Using Navigation Bar
- Click **"Dashboard"** to go to the main dashboard
- Click **"Analytics"** to view detailed analytics

### Direct URLs
- Dashboard: `http://localhost:3000/`
- Analytics: `http://localhost:3000/analytics`

## 📊 Key Differences

| Feature | Dashboard Page | Analytics Page |
|---------|---------------|----------------|
| **Focus** | Real-time operations | Historical analysis |
| **Layout** | 2-column grid (dashboard + recommendations) | Full-width analytics |
| **Charts** | Basic trend lines | Multiple chart types (line, bar, area) |
| **Data View** | Current + 30-day trends | Aggregated averages + forecasts |
| **Use Case** | Daily monitoring | Weekly/monthly planning |

## 🎨 Visual Differences

### Dashboard Page
- Card-based layout
- Side-by-side dashboard and recommendations
- Quick status indicators
- Mobile-optimized stacking

### Analytics Page
- Full-width charts
- Statistical summaries
- Comparative visualizations
- Detailed trend analysis

## 🔄 Data Refresh

Both pages automatically refresh:
- **Dashboard**: Every 5 minutes
- **Analytics**: Manual refresh button available

## 💡 Use Cases

### When to Use Dashboard:
- Daily field monitoring
- Quick decision making
- Real-time alerts
- Current status checks

### When to Use Analytics:
- Weekly planning
- Trend analysis
- Performance review
- Forecasting decisions


