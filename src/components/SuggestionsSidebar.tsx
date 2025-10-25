import { ExternalLink, Video, FileText, TrendingUp, TrendingDown, Lightbulb, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Reference {
  title: string;
  author: string;
  link: string;
}

interface LearningRecommendation {
  category: string;
  recommendation: string;
  video_link?: string;
}

interface SuggestionsSidebarProps {
  learningRecommendations?: LearningRecommendation[];
  videos?: Reference[];
  articles?: Reference[];
  caseStudies?: Reference[];
  successStories?: Reference[];
  failureStories?: Reference[];
  vendors?: Reference[];
}

export function SuggestionsSidebar({
  learningRecommendations = [],
  videos = [],
  articles = [],
  caseStudies = [],
  successStories = [],
  failureStories = [],
  vendors = [],
}: SuggestionsSidebarProps) {
  
  // Filter out placeholder items
  const filterPlaceholders = (items: Reference[]) => 
    items.filter(item => !item.title.toLowerCase().includes('placeholder'));

  const filteredVideos = filterPlaceholders(videos);
  const filteredArticles = filterPlaceholders(articles);
  const filteredCaseStudies = filterPlaceholders(caseStudies);
  const filteredSuccessStories = filterPlaceholders(successStories);
  const filteredFailureStories = filterPlaceholders(failureStories);
  const filteredVendors = filterPlaceholders(vendors);

  const hasContent = 
    learningRecommendations.length > 0 ||
    filteredVideos.length > 0 ||
    filteredArticles.length > 0 ||
    filteredCaseStudies.length > 0 ||
    filteredSuccessStories.length > 0 ||
    filteredFailureStories.length > 0 ||
    filteredVendors.length > 0;

  if (!hasContent) {
    return (
      <div className="w-80 bg-gray-50 p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Suggestions</h3>
        <p className="text-sm text-gray-600">Resources to help you succeed</p>
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            No suggestions available yet. Complete the previous steps to get personalized recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 p-4 overflow-y-auto max-h-screen">
      <h3 className="font-semibold text-gray-900 mb-4">Suggestions</h3>
      <p className="text-sm text-gray-600 mb-4">Resources to help you succeed</p>

      <div className="space-y-4">
        {/* Learning Recommendations */}
        {learningRecommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                Learning Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {learningRecommendations.map((rec, index) => (
                <div key={index} className="text-sm">
                  <Badge variant="secondary" className="mb-1 text-xs">
                    {rec.category}
                  </Badge>
                  <p className="text-gray-700 mb-1">{rec.recommendation}</p>
                  {rec.video_link && (
                    <a
                      href={rec.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                    >
                      <Video className="w-3 h-3" />
                      Watch Video
                    </a>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Videos */}
        {filteredVideos.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-red-600" />
                Videos ({filteredVideos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredVideos.slice(0, 5).map((video, index) => (
                <a
                  key={index}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-gray-900 font-medium line-clamp-2">{video.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{video.author}</p>
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Articles */}
        {filteredArticles.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Articles ({filteredArticles.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredArticles.slice(0, 5).map((article, index) => (
                <a
                  key={index}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-gray-900 font-medium line-clamp-2">{article.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{article.author}</p>
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Case Studies */}
        {filteredCaseStudies.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Case Studies ({filteredCaseStudies.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredCaseStudies.slice(0, 3).map((study, index) => (
                <a
                  key={index}
                  href={study.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-gray-900 font-medium line-clamp-2">{study.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{study.author}</p>
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Success Stories */}
        {filteredSuccessStories.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Success Stories ({filteredSuccessStories.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredSuccessStories.slice(0, 3).map((story, index) => (
                <a
                  key={index}
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-gray-900 font-medium line-clamp-2">{story.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{story.author}</p>
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Failure Stories */}
        {filteredFailureStories.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                Lessons from Failures ({filteredFailureStories.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredFailureStories.slice(0, 3).map((story, index) => (
                <a
                  key={index}
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-gray-900 font-medium line-clamp-2">{story.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{story.author}</p>
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Vendors */}
        {filteredVendors.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                Recommended Vendors ({filteredVendors.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredVendors.slice(0, 5).map((vendor, index) => (
                <a
                  key={index}
                  href={vendor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-gray-900 font-medium line-clamp-2">{vendor.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{vendor.author}</p>
                </a>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
