
import React, { useState, useEffect, useCallback } from 'react';
import { MarketingCampaign } from '@/entities/MarketingCampaign';
import { SocialMediaPost } from '@/entities/SocialMediaPost';
import { ContentIdea } from '@/entities/ContentIdea';
import { MarketingMaterial } from '@/entities/MarketingMaterial';
import { MarketingTask } from '@/entities/MarketingTask';
import { User } from '@/entities/User';
import { UploadFile } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Instagram, Calendar as CalendarIcon, Target, Play,
  Users, Upload, CheckCircle, Lightbulb,
  Plus, Edit, Trash2, Eye, BarChart3, Share2, Video, Loader2, DollarSign, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const services = ["plano_carreira", "revela_talentos", "intercambios", "campeonatos", "eurocamp", "geral"];
const campaignPlatforms = ["meta_ads", "google_ads", "tiktok_ads", "youtube_ads", "organic"];
const campaignTypes = ["lead_generation", "brand_awareness", "conversion", "retargeting", "engagement"];
const campaignStatus = ["draft", "active", "paused", "completed", "cancelled"];
const postPlatforms = ["instagram", "facebook", "tiktok", "youtube", "linkedin"];
const postContentTypes = ["image", "video", "carousel", "story", "reel", "live"];
const postStatus = ["idea", "draft", "review", "approved", "scheduled", "published", "cancelled"];
const contentPillars = ["dor", "autoridade", "urgencia", "mentalidade", "prova_social", "educativo", "promocional"];
const ideaContentTypes = ["reel", "post", "story", "carrossel", "live", "video_longo"];
const ideaStatus = ["suggested", "approved", "in_production", "published", "rejected"];
const ideaPriorities = ["low", "medium", "high", "urgent"];
const materialCategories = ["arte", "video", "copy", "template", "apresentacao", "ebook"];

const CampaignCard = ({ campaign, onEdit, onToggleStatus }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500',
      paused: 'bg-yellow-500',
      completed: 'bg-blue-500',
      draft: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const cpl = campaign.metrics?.cost_per_lead || 0;
  const leadsGenerated = campaign.metrics?.leads_generated || 0;

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-white mb-1">{campaign.campaign_name}</h3>
            <p className="text-sm text-gray-400">{campaign.platform} • {campaign.campaign_type}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={`${getStatusColor(campaign.status)} text-white`}>
              {campaign.status}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => onEdit(campaign)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{leadsGenerated}</p>
            <p className="text-xs text-gray-500">Leads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">R$ {cpl.toFixed(2)}</p>
            <p className="text-xs text-gray-500">CPL</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">R$ {(campaign.metrics?.spend || 0).toLocaleString('pt-BR')}</p>
            <p className="text-xs text-gray-500">Gasto</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge className="bg-purple-600/20 text-purple-300 text-xs">
            {campaign.service_target}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(campaign)}
            className={campaign.status === 'active' ? 'text-yellow-400' : 'text-green-400'}
          >
            {campaign.status === 'active' ? 'Pausar' : 'Ativar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PostCard = ({ post, onEdit }) => {
  const getStatusColor = (status) => {
    const colors = {
      idea: 'bg-gray-500',
      draft: 'bg-yellow-500',
      review: 'bg-orange-500',
      approved: 'bg-blue-500',
      scheduled: 'bg-purple-500',
      published: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: Instagram,
      tiktok: Video,
      youtube: Play,
      facebook: Share2,
      linkedin: Users
    };
    const IconComponent = icons[platform] || Share2;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getPlatformIcon(post.platform)}
            <span className="text-sm font-medium text-white">{post.platform}</span>
            <Badge className="text-xs bg-purple-600/20 text-purple-300">
              {post.content_type}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Badge className={`${getStatusColor(post.post_status)} text-white text-xs`}>
              {post.post_status}
            </Badge>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(post)}>
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{post.caption}</p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          {post.scheduled_date && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{format(new Date(post.scheduled_date), 'dd/MM HH:mm', { locale: ptBR })}</span>
            </div>
          )}
          {post.content_pillar && (
            <Badge variant="outline" className="text-xs">
              {post.content_pillar}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ContentIdeaCard = ({ idea, onEdit, onApprove }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-600',
      medium: 'bg-yellow-600',
      high: 'bg-orange-600',
      urgent: 'bg-red-600'
    };
    return colors[priority] || 'bg-gray-600';
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-white text-sm">{idea.title}</h4>
          <Badge className={`${getPriorityColor(idea.priority)} text-white text-xs`}>
            {idea.priority}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{idea.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-blue-600/20 text-blue-300 text-xs">{idea.content_type}</Badge>
          <Badge className="bg-purple-600/20 text-purple-300 text-xs">{idea.content_pillar}</Badge>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="text-green-400 border-green-400" onClick={() => onApprove(idea)}>
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(idea)}>
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CalendarView = ({ posts, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getPostsForDate = (date) => {
    return posts.filter(post => {
      if (!post.scheduled_date) return false;
      const postDate = new Date(post.scheduled_date);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = [];
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(startDate, i));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Calendário Editorial</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
            Semana Anterior
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
            Próxima Semana
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const postsForDay = getPostsForDate(day);
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={day.toISOString()}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 bg-gray-800'
              } hover:border-gray-600`}
              onClick={() => onDateSelect(day)}
            >
              <div className="text-center mb-2">
                <p className="text-sm font-medium text-white">
                  {format(day, 'EEE', { locale: ptBR })}
                </p>
                <p className="text-lg font-bold text-gray-300">
                  {format(day, 'dd')}
                </p>
              </div>
              <div className="space-y-1">
                {postsForDay.slice(0, 3).map(post => (
                  <div key={post.id} className="text-xs p-1 bg-purple-600/20 rounded text-purple-300 truncate">
                    {post.platform} - {post.content_type}
                  </div>
                ))}
                {postsForDay.length > 3 && (
                  <div className="text-xs text-gray-500">+{postsForDay.length - 3} mais</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MaterialLibrary = ({ materials, onUpload, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMaterials = materials.filter(material => 
    selectedCategory === 'all' || material.category === selectedCategory
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Biblioteca de Materiais</h3>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Materiais</SelectItem>
              <SelectItem value="arte">Artes</SelectItem>
              <SelectItem value="video">Vídeos</SelectItem>
              <SelectItem value="copy">Copies</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
              <SelectItem value="apresentacao">Apresentações</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onUpload} className="bg-purple-600 hover:bg-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Material
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(material => (
          <Card key={material.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-white text-sm">{material.title}</h4>
                  <p className="text-xs text-gray-400">{material.category}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => window.open(material.file_url, '_blank')}>
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(material)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">{material.description}</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600/20 text-blue-300 text-xs">
                  {material.service_related}
                </Badge>
                <span className="text-xs text-gray-500">{material.usage_count} usos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const MarketingReports = ({ campaigns, posts, ideas }) => {
  const campaignData = campaigns.map(c => ({
    name: c.campaign_name.slice(0, 15) + '...',
    leads: c.metrics?.leads_generated || 0,
    spend: c.metrics?.spend || 0,
    cpl: c.metrics?.cost_per_lead || 0
  }));

  const postsByPlatform = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {});

  const platformData = Object.entries(postsByPlatform).map(([platform, count]) => ({
    name: platform,
    value: count
  }));

  const totalLeads = campaigns.reduce((sum, c) => sum + (c.metrics?.leads_generated || 0), 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.metrics?.spend || 0), 0);
  const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-900/20 border-green-800">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalLeads}</p>
            <p className="text-xs text-green-300">Leads Gerados</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-900/20 border-blue-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">R$ {totalSpend.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-blue-300">Investimento Total</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-900/20 border-purple-800">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">R$ {avgCPL.toFixed(2)}</p>
            <p className="text-xs text-purple-300">CPL Médio</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-900/20 border-orange-800">
          <CardContent className="p-4 text-center">
            <Lightbulb className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{ideas.filter(i => i.status === 'approved').length}</p>
            <p className="text-xs text-orange-300">Ideias Aprovadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Performance por Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Bar dataKey="leads" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Distribuição por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- MODAIS DE FORMULÁRIO ---

const CampaignFormModal = ({ isOpen, onClose, onSave, campaign, services, platforms, types }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (campaign) {
      setFormData({
        ...campaign,
        start_date: campaign.start_date ? format(new Date(campaign.start_date), 'yyyy-MM-dd') : '',
        end_date: campaign.end_date ? format(new Date(campaign.end_date), 'yyyy-MM-dd') : '',
        metrics: campaign.metrics || { cost_per_lead: 0, leads_generated: 0, spend: 0 }
      });
    } else {
      setFormData({
        campaign_name: '', platform: 'meta_ads', campaign_type: 'lead_generation', service_target: 'geral',
        status: 'draft', budget_total: 0, metrics: { cost_per_lead: 0, leads_generated: 0, spend: 0 }
      });
    }
  }, [campaign, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMetricsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, metrics: { ...prev.metrics, [name]: parseFloat(value) || 0 }}));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{campaign ? 'Editar Campanha' : 'Nova Campanha'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="campaign_name" placeholder="Nome da Campanha" value={formData.campaign_name || ''} onChange={handleChange} required className="bg-gray-800"/>
          <div className="grid grid-cols-2 gap-4">
            <Select name="platform" value={formData.platform} onValueChange={(v) => handleSelectChange('platform', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
            <Select name="campaign_type" value={formData.campaign_type} onValueChange={(v) => handleSelectChange('campaign_type', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            <Select name="service_target" value={formData.service_target} onValueChange={(v) => handleSelectChange('service_target', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            <Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{campaignStatus.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Início</Label><Input name="start_date" type="date" value={formData.start_date || ''} onChange={handleChange} className="bg-gray-800"/></div>
            <div><Label>Fim</Label><Input name="end_date" type="date" value={formData.end_date || ''} onChange={handleChange} className="bg-gray-800"/></div>
          </div>
           <div className="grid grid-cols-3 gap-4">
            <div><Label>Leads</Label><Input name="leads_generated" type="number" value={formData.metrics?.leads_generated || 0} onChange={handleMetricsChange} className="bg-gray-800"/></div>
            <div><Label>CPL (R$)</Label><Input name="cost_per_lead" type="number" step="0.01" value={formData.metrics?.cost_per_lead || 0} onChange={handleMetricsChange} className="bg-gray-800"/></div>
            <div><Label>Gasto (R$)</Label><Input name="spend" type="number" step="0.01" value={formData.metrics?.spend || 0} onChange={handleMetricsChange} className="bg-gray-800"/></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const PostFormModal = ({ isOpen, onClose, onSave, post }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        scheduled_date: post.scheduled_date ? format(new Date(post.scheduled_date), "yyyy-MM-dd'T'HH:mm") : '',
      });
    } else {
      setFormData({
        platform: 'instagram', content_type: 'reel', post_status: 'draft', content_pillar: 'prova_social', caption: '', scheduled_date: ''
      });
    }
  }, [post, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Post' : 'Novo Post'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <Select name="platform" value={formData.platform} onValueChange={(v) => handleSelectChange('platform', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{postPlatforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
             <Select name="content_type" value={formData.content_type} onValueChange={(v) => handleSelectChange('content_type', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{postContentTypes.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          </div>
          <Textarea name="caption" placeholder="Legenda do post..." value={formData.caption || ''} onChange={handleChange} required className="bg-gray-800 h-24"/>
          <div className="grid grid-cols-2 gap-4">
             <Select name="post_status" value={formData.post_status} onValueChange={(v) => handleSelectChange('post_status', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{postStatus.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
             <Select name="content_pillar" value={formData.content_pillar} onValueChange={(v) => handleSelectChange('content_pillar', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{contentPillars.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          </div>
           <div><Label>Agendamento</Label><Input name="scheduled_date" type="datetime-local" value={formData.scheduled_date || ''} onChange={handleChange} className="bg-gray-800"/></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const IdeaFormModal = ({ isOpen, onClose, onSave, idea }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (idea) {
            setFormData(idea);
        } else {
            setFormData({ title: '', description: '', content_type: 'reel', platform: 'instagram', content_pillar: 'dor', priority: 'medium', status: 'suggested' });
        }
    }, [idea, isOpen]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader><DialogTitle>{idea ? 'Editar Ideia' : 'Nova Ideia'}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" placeholder="Título da ideia" value={formData.title || ''} onChange={handleChange} required className="bg-gray-800"/>
                    <Textarea name="description" placeholder="Descrição..." value={formData.description || ''} onChange={handleChange} className="bg-gray-800 h-20"/>
                    <div className="grid grid-cols-2 gap-4">
                        <Select name="content_type" value={formData.content_type} onValueChange={(v) => handleSelectChange('content_type', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{ideaContentTypes.map(c => <SelectItem value={c} key={c}>{c}</SelectItem>)}</SelectContent></Select>
                        <Select name="priority" value={formData.priority} onValueChange={(v) => handleSelectChange('priority', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{ideaPriorities.map(p => <SelectItem value={p} key={p}>{p}</SelectItem>)}</SelectContent></Select>
                    </div>
                     <Select name="content_pillar" value={formData.content_pillar} onValueChange={(v) => handleSelectChange('content_pillar', v)}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{contentPillars.map(p => <SelectItem value={p} key={p}>{p}</SelectItem>)}</SelectContent></Select>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Salvar Ideia</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const MaterialFormModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ title: '', description: '', file_url: '', file_type: 'image', category: 'arte', service_related: 'geral' });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const uploadedFile = await UploadFile({ file });
            setFormData(prev => ({ ...prev, file_url: uploadedFile.file_url, file_type: uploadedFile.file_type || 'image' }));
            toast.success("Arquivo carregado com sucesso!");
        } catch (error) {
            toast.error("Falha no upload do arquivo.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    }

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader><DialogTitle>Upload de Material</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" placeholder="Título do material" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required className="bg-gray-800"/>
                    <Textarea name="description" placeholder="Descrição" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="bg-gray-800"/>
                    <div className="grid grid-cols-2 gap-4">
                        <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v }))}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{materialCategories.map(c => <SelectItem value={c} key={c}>{c}</SelectItem>)}</SelectContent></Select>
                        <Select value={formData.service_related} onValueChange={v => setFormData(p => ({ ...p, service_related: v }))}><SelectTrigger className="bg-gray-800"><SelectValue/></SelectTrigger><SelectContent>{services.map(s => <SelectItem value={s} key={s}>{s}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div>
                        <Label>Arquivo</Label>
                        <Input type="file" onChange={handleFileChange} className="bg-gray-800" disabled={isUploading}/>
                        {isUploading && <Loader2 className="w-4 h-4 animate-spin mt-2"/>}
                        {formData.file_url && <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs truncate block mt-2">Ver arquivo</a>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={isUploading || !formData.file_url}>Salvar Material</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


// --- COMPONENTE PRINCIPAL ---

export default function AdminMarketingTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [posts, setPosts] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campanhas');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modais
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [campaignsData, postsData, ideasData, materialsData, tasksData, usersData] = await Promise.all([
        MarketingCampaign.list('-created_date').catch(() => []),
        SocialMediaPost.list('-scheduled_date').catch(() => []),
        ContentIdea.list('-created_date').catch(() => []),
        MarketingMaterial.list('-created_date').catch(() => []),
        MarketingTask.list('-created_date').catch(() => []),
        User.list().catch(() => [])
      ]);

      setCampaigns(campaignsData || []);
      setPosts(postsData || []);
      setIdeas(ideasData || []);
      setMaterials(materialsData || []);
      setTasks(tasksData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Erro ao carregar dados de marketing:', error);
      toast.error('Erro ao carregar dados de marketing');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Funções de manipulação
  const handleSaveCampaign = async (campaignData) => {
    try {
      if (editingItem) {
        await MarketingCampaign.update(editingItem.id, campaignData);
        toast.success('Campanha atualizada!');
      } else {
        await MarketingCampaign.create(campaignData);
        toast.success('Campanha criada!');
      }
      setShowCampaignModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar campanha');
    }
  };

  const handleSavePost = async (postData) => {
    try {
      if (editingItem) {
        await SocialMediaPost.update(editingItem.id, postData);
        toast.success('Post atualizado!');
      } else {
        await SocialMediaPost.create(postData);
        toast.success('Post criado!');
      }
      setShowPostModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar post');
    }
  };

  const handleSaveIdea = async (ideaData) => {
    try {
        if(editingItem) {
            await ContentIdea.update(editingItem.id, ideaData);
            toast.success('Ideia atualizada!');
        } else {
            await ContentIdea.create(ideaData);
            toast.success('Ideia criada!');
        }
        setShowIdeaModal(false);
        setEditingItem(null);
        loadData();
    } catch (error) {
        toast.error('Erro ao salvar ideia');
    }
  };
  
  const handleSaveMaterial = async (materialData) => {
    try {
        await MarketingMaterial.create(materialData);
        toast.success('Material salvo!');
        setShowMaterialModal(false);
        loadData();
    } catch (error) {
        toast.error('Erro ao salvar material');
    }
  };

  const handleApproveIdea = async (idea) => {
    try {
      await ContentIdea.update(idea.id, { status: 'approved' });
      toast.success('Ideia aprovada!');
      loadData();
    } catch (error) {
      toast.error('Erro ao aprovar ideia');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  const activeLeadsFromCampaigns = campaigns.reduce((sum, c) => sum + (c.metrics?.leads_generated || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const scheduledPosts = posts.filter(p => p.post_status === 'scheduled').length;
  const pendingIdeas = ideas.filter(i => i.status === 'suggested').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Central de Marketing</h2>
          <p className="text-gray-400">Hub completo de marketing digital e social media</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-900/20 border-blue-800">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{activeLeadsFromCampaigns}</p>
            <p className="text-xs text-blue-300">Leads Gerados</p>
          </CardContent>
        </Card>
        <Card className="bg-green-900/20 border-green-800">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{activeCampaigns}</p>
            <p className="text-xs text-green-300">Campanhas Ativas</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-900/20 border-purple-800">
          <CardContent className="p-4 text-center">
            <Instagram className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{scheduledPosts}</p>
            <p className="text-xs text-purple-300">Posts Agendados</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-900/20 border-orange-800">
          <CardContent className="p-4 text-center">
            <Lightbulb className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{pendingIdeas}</p>
            <p className="text-xs text-orange-300">Ideias Pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 grid w-full grid-cols-6">
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="ideias">Banco de Ideias</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="campanhas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Gestão de Campanhas</h3>
            <Button onClick={() => { setEditingItem(null); setShowCampaignModal(true); }} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={(c) => { setEditingItem(c); setShowCampaignModal(true); }}
                onToggleStatus={(c) => {
                  const newStatus = c.status === 'active' ? 'paused' : 'active';
                  MarketingCampaign.update(c.id, { status: newStatus }).then(() => {
                    toast.success(`Campanha ${newStatus === 'active' ? 'ativada' : 'pausada'}!`);
                    loadData();
                  });
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Gestão de Social Media</h3>
            <Button onClick={() => { setEditingItem(null); setShowPostModal(true); }} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={(p) => { setEditingItem(p); setShowPostModal(true); }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendario">
          <CalendarView
            posts={posts}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </TabsContent>

        <TabsContent value="ideias" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Banco de Ideias</h3>
            <Button onClick={() => { setEditingItem(null); setShowIdeaModal(true); }} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Ideia
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map(idea => (
              <ContentIdeaCard
                key={idea.id}
                idea={idea}
                onEdit={(i) => { setEditingItem(i); setShowIdeaModal(true); }}
                onApprove={handleApproveIdea}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materiais">
          <MaterialLibrary
            materials={materials}
            onUpload={() => setShowMaterialModal(true)}
            onDelete={async (m) => {
              if (window.confirm('Tem certeza que deseja remover este material?')) {
                await MarketingMaterial.delete(m.id);
                toast.success('Material removido!');
                loadData();
              }
            }}
          />
        </TabsContent>

        <TabsContent value="relatorios">
          <MarketingReports
            campaigns={campaigns}
            posts={posts}
            ideas={ideas}
          />
        </TabsContent>
      </Tabs>

      <CampaignFormModal
        isOpen={showCampaignModal}
        onClose={() => { setEditingItem(null); setShowCampaignModal(false); }}
        onSave={handleSaveCampaign}
        campaign={editingItem}
        services={services}
        platforms={campaignPlatforms}
        types={campaignTypes}
      />
      
      <PostFormModal
        isOpen={showPostModal}
        onClose={() => { setEditingItem(null); setShowPostModal(false); }}
        onSave={handleSavePost}
        post={editingItem}
      />

      <IdeaFormModal
        isOpen={showIdeaModal}
        onClose={() => { setEditingItem(null); setShowIdeaModal(false); }}
        onSave={handleSaveIdea}
        idea={editingItem}
      />

      <MaterialFormModal
        isOpen={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        onSave={handleSaveMaterial}
      />
    </div>
  );
}
