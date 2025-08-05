import React, { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Image,
  FileText,
  Video,
  Music,
  Archive
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  userId: string;
}

const FileUploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load uploaded files on component mount
  React.useEffect(() => {
    if (user) {
      loadUploadedFiles();
    }
  }, [user]);

  const loadUploadedFiles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const filesCollection = collection(db, 'files');
      const querySnapshot = await getDocs(filesCollection);
      const userFiles: UploadedFile[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          userFiles.push({
            id: doc.id,
            name: data.name,
            url: data.url,
            size: data.size,
            type: data.type,
            uploadedAt: data.uploadedAt.toDate(),
            userId: data.userId
          });
        }
      });
      
      setUploadedFiles(userFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load uploaded files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      setFiles(droppedFiles);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const uploadFiles = async () => {
    if (!user || files.length === 0) return;

    setIsUploading(true);
    const newProgress: { [key: string]: number } = {};

    try {
      for (const file of files) {
        const fileId = `${file.name}-${Date.now()}`;
        newProgress[fileId] = 0;
        setUploadProgress({ ...newProgress });

        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, `files/${user.uid}/${fileId}`);
        
        // Upload file
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              newProgress[fileId] = progress;
              setUploadProgress({ ...newProgress });
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              try {
                // Get download URL
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // Save file metadata to Firestore
                await addDoc(collection(db, 'files'), {
                  name: file.name,
                  url: downloadURL,
                  size: file.size,
                  type: file.type,
                  uploadedAt: new Date(),
                  userId: user.uid
                });

                resolve(downloadURL);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      }

      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      });

      // Reset form and reload files
      setFiles([]);
      setUploadProgress({});
      await loadUploadedFiles();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      await deleteDoc(doc(db, 'files', fileId));
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-5 h-5" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Upload</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your files with Firebase Storage
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Files
            </CardTitle>
            <CardDescription>
              Select files to upload to your storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <Label htmlFor="file-input">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Browse Files</span>
                  </Button>
                </Label>
              </div>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Files:</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                      </div>
                      {uploadProgress[`${file.name}-${Date.now()}`] !== undefined && (
                        <div className="w-32 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress[`${file.name}-${Date.now()}`]}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={uploadFiles} 
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Upload Files
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Uploaded Files Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Uploaded Files
            </CardTitle>
            <CardDescription>
              Your uploaded files ({uploadedFiles.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading files...</p>
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <File className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default FileUploadPage;
