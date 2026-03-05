
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Video, 
  Camera, 
  FolderOpen,
  ExternalLink,
  Loader2,
  CheckCircle, 
  XCircle 
} from "lucide-react";

import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function MaterialGallery({ user, uploads, onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState([]); // [{fileName, status: 'pending'|'uploading'|'success'|'error', message?}] 
  const [uploadData, setUploadData] = useState({
    description: "",
    category: "jogo"
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFileSelect = (e) => {
    if (isUploading) return;
    
    const files = Array.from(e.target.files);
    
    // VALIDAÇÃO DE TAMANHO ANTES DE ACEITAR
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB por arquivo
    const invalidFiles = files.filter(f => f.size > maxSizeBytes);
    
    if (invalidFiles.length > 0) {
      const filesList = invalidFiles.map(f => 
        `• ${f.name}: ${(f.size / (1024 * 1024)).toFixed(1)}MB`
      ).join('\n');
      
      toast.error(
        `🚫 Arquivo(s) muito grande(s)!\n\n` +
        `${filesList}\n\n` +
        `Limite máximo: 10MB por arquivo.\n\n` +
        `💡 Para arquivos grandes, hospede no YouTube/Drive e compartilhe o link com a equipe.`,
        { 
          duration: 8000,
          style: { background: '#7f1d1d', color: '#fff', border: '2px solid #dc2626' }
        }
      );
      
      e.target.value = ''; // Limpa input para permitir nova seleção sem os arquivos inválidos
      setSelectedFiles([]); // Clear any previously selected files if new selection has invalid ones
      return;
    }
    
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !user) return;
    
    // Validação final antes de upload (redundante, mas como safeguard)
    const maxSizeBytes = 10 * 1024 * 1024;
    const invalidFiles = selectedFiles.filter(f => f.size > maxSizeBytes);
    
    if (invalidFiles.length > 0) {
      toast.error('Alguns arquivos excedem o limite de 10MB. Por favor, remova-os da seleção e tente novamente.');
      // This case should ideally not be hit if handleFileSelect works correctly, but it's a good safeguard.
      setSelectedFiles([]); // Clear selection as it contains invalid files
      return;
    }
    
    setIsUploading(true);
    setUploadStatus(selectedFiles.map(file => ({ fileName: file.name, status: 'pending' })));
    toast.info(`Iniciando upload de ${selectedFiles.length} arquivo(s)...`);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      setUploadStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'uploading' } : s));

      try {
        const { file_url } = await base44.storage.uploadFile({ file });
        
        await base44.entities.AthleteUpload.create({
          user_id: user.id,
          file_url,
          file_name: file.name,
          file_type: file.type.startsWith('video/') ? 'video' : 'photo',
          category: uploadData.category,
          description: uploadData.description,
          processing_status: 'completed',
          file_size: file.size
        });
        
        setUploadStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success' } : s));
        toast.success(`Arquivo "${file.name}" enviado com sucesso!`);

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        setUploadStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'error', message: error.message } : s));
        toast.error(`Erro ao enviar "${file.name}".`);
      }
    }
    
    toast.success("Processo de upload finalizado.");
    setIsUploading(false);
    setSelectedFiles([]);
    setUploadData({ description: "", category: "jogo" });
    if(onUploadComplete) onUploadComplete();
  };

  const filteredUploads = useMemo(() => {
    if (activeFilter === 'all') return uploads;
    if (activeFilter === 'videos') return uploads.filter(u => u.file_type === 'video');
    if (activeFilter === 'photos') return uploads.filter(u => u.file_type === 'photo');
    return uploads;
  }, [uploads, activeFilter]);
  
  const filterOptions = [
    { id: 'all', label: 'Todos' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'photos', label: 'Fotos' }
  ];


  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Meu Material</h1>
      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Upload className="w-5 h-5" />
              Adicionar Novo Material
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Input
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="bg-gray-800 border-gray-700 text-white file:text-white file:bg-gray-700 file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4 hover:file:bg-gray-600"
              />
              
              <p className="text-xs text-amber-400 -mt-2">
                ⚠️ Limite: 10MB por arquivo. Para vídeos maiores, hospede no YouTube/Drive.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 w-full"
                  disabled={isUploading}
                >
                  <option value="jogo">Jogo</option>
                  <option value="treino">Treino</option>
                  <option value="marketing">Marketing</option>
                  <option value="outros">Outros</option>
                </select>
                
                <Input
                  placeholder="Descrição (opcional)"
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled={isUploading}
                />
              </div>
              
              {isUploading ? (
                 <div className="space-y-2 p-2 border border-gray-700 rounded-lg max-h-40 overflow-y-auto">
                    {uploadStatus.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {file.status === 'pending' && <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />}
                        {file.status === 'uploading' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                        {file.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {file.status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                        <span className="flex-1 truncate">{file.fileName}</span>
                      </div>
                    ))}
                 </div>
              ) : (
                <Button 
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Upload className="w-4 h-4 mr-2"/>
                  {`Fazer Upload (${selectedFiles.length} arquivo${selectedFiles.length !== 1 ? 's' : ''})`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Materials Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <FolderOpen className="w-5 h-5" />
                Galeria de Mídia ({filteredUploads.length})
              </CardTitle>
              <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg">
                {filterOptions.map(opt => (
                  <Button 
                    key={opt.id}
                    onClick={() => setActiveFilter(opt.id)}
                    className={`text-xs px-3 py-1 h-auto transition-all ${
                      activeFilter === opt.id ? 'bg-green-600 text-white shadow-sm' : 'bg-transparent text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {uploads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUploads.map((upload, index) => (
                  <motion.div
                    key={upload.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Card className="bg-gray-800/50 border-gray-700 overflow-hidden hover:border-green-500/50 transition-colors">
                      <a href={upload.file_url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video">
                        {upload.file_type === 'video' ? (
                            <div className="w-full h-full bg-black flex items-center justify-center">
                                <video src={upload.file_url} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                          <img src={upload.file_url} alt={upload.file_name} className="w-full h-full object-cover"/>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                      </a>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-white text-sm mb-2 truncate" title={upload.file_name}>
                          {upload.file_name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-900 text-green-300 border border-green-700 text-xs">
                            {upload.category}
                          </Badge>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            {upload.file_type === 'video' ? <Video className="w-3 h-3"/> : <Camera className="w-3 h-3"/>}
                            {upload.file_type}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FolderOpen className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Nenhum arquivo encontrado</h3>
                <p>Use o formulário acima para adicionar seus vídeos e fotos.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


