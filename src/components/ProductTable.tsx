import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { Product } from '@/types';
import * as XLSX from 'xlsx';

interface ProductTableProps {
  products: Product[];
  onChange: (products: Product[]) => void;
  subtotal: number;
  vatAmount: number;
  vatIncluded: boolean;
  vatRate: number;
}

// Format number to financial style (e.g., 10.000,50)
const formatNumber = (num: number, roundToWhole: boolean = false): string => {
  const value = roundToWhole ? Math.round(num) : num;
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.', ',');
};

export default function ProductTable({
  products,
  onChange,
  subtotal,
  vatAmount,
  vatIncluded,
  vatRate,
}: ProductTableProps) {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    description: '',
    brand: '',
    unit: 'adet',
    quantity: 1,
    unitPrice: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [roundToWhole, setRoundToWhole] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onChange(items);
  };

  const handleAddProduct = () => {
    if (!newProduct.description || !newProduct.unitPrice) return;
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      description: newProduct.description,
      brand: newProduct.brand || '',
      unit: newProduct.unit || 'adet',
      quantity: newProduct.quantity || 1,
      unitPrice: newProduct.unitPrice,
      totalPrice: (newProduct.quantity || 1) * newProduct.unitPrice,
    };
    onChange([...products, product]);
    setNewProduct({
      description: '',
      brand: '',
      unit: 'adet',
      quantity: 1,
      unitPrice: 0,
    });
  };

  const handleDeleteProduct = (id: string) => {
    onChange(products.filter(product => product.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setEditProduct({ ...product });
  };

  const handleSaveEdit = () => {
    if (!editingId || !editProduct.description || !editProduct.unitPrice) return;
    
    const updatedProducts = products.map(product => {
      if (product.id === editingId) {
        return {
          ...product,
          description: editProduct.description || '',
          brand: editProduct.brand || '',
          unit: editProduct.unit || 'adet',
          quantity: editProduct.quantity || 1,
          unitPrice: editProduct.unitPrice || 0,
          totalPrice: (editProduct.quantity || 1) * (editProduct.unitPrice || 0),
        };
      }
      return product;
    });
    
    onChange(updatedProducts);
    setEditingId(null);
    setEditProduct({});
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teklif');
    XLSX.writeFile(workbook, 'teklif.xlsx');
  };

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Sıra</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Açıklama</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Marka</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Miktar</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Birim</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Malzeme Birim Fiyatı</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Toplam Fiyat</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>İşlem</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {products.map((product, index) => (
                    <Draggable
                      key={product.id}
                      draggableId={product.id}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {editingId === product.id ? (
                              <TextField
                                fullWidth
                                value={editProduct.description}
                                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                size="small"
                              />
                            ) : (
                              product.description
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === product.id ? (
                              <TextField
                                fullWidth
                                value={editProduct.brand}
                                onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                                size="small"
                              />
                            ) : (
                              product.brand
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === product.id ? (
                              <TextField
                                fullWidth
                                type="number"
                                value={editProduct.quantity}
                                onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) || 1 })}
                                size="small"
                                InputProps={{ inputProps: { min: 1 } }}
                              />
                            ) : (
                              product.quantity
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === product.id ? (
                              <TextField
                                fullWidth
                                value={editProduct.unit}
                                onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })}
                                size="small"
                              />
                            ) : (
                              product.unit
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === product.id ? (
                              <TextField
                                fullWidth
                                type="number"
                                value={editProduct.unitPrice}
                                onChange={(e) => setEditProduct({ ...editProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                                size="small"
                                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                              />
                            ) : (
                              formatNumber(product.unitPrice, roundToWhole)
                            )}
                          </TableCell>
                          <TableCell>{formatNumber(product.totalPrice, roundToWhole)}</TableCell>
                          <TableCell>
                            {editingId === product.id ? (
                              <IconButton onClick={handleSaveEdit} color="primary">
                                <SaveIcon />
                              </IconButton>
                            ) : (
                              <>
                                <IconButton onClick={() => handleEditProduct(product)} color="primary">
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteProduct(product.id)} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>

      {/* Alt Hesaplama Kutusu */}
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <Grid item xs={12} sm={7} md={5}>
          <Box sx={{ background: '#f8fafd', borderRadius: 2, p: 2, mb: 2, textAlign: 'right', boxShadow: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={roundToWhole}
                  onChange={(e) => setRoundToWhole(e.target.checked)}
                  color="primary"
                />
              }
              label="Fiyatları tam sayıya yuvarla"
              sx={{ mb: 1, justifyContent: 'flex-end' }}
            />
            <Typography fontWeight={700} sx={{ fontFamily: 'monospace' }}>
              Ara Toplam: {formatNumber(subtotal, roundToWhole)}
            </Typography>
            {vatIncluded && (
              <Typography fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                KDV (%{vatRate}): {formatNumber(vatAmount, roundToWhole)}
              </Typography>
            )}
            <Typography fontWeight={700} fontSize={18} color="primary" sx={{ fontFamily: 'monospace' }}>
              Genel Toplam: {formatNumber(vatIncluded ? (subtotal + vatAmount) : subtotal, roundToWhole)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Yeni Ürün Ekleme Alanı */}
      <Box sx={{ 
        mt: 3, 
        p: 3, 
        background: '#f8fafd', 
        borderRadius: 2,
        boxShadow: 2
      }}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          color="primary" 
          sx={{ mb: 3 }}
        >
          Yeni Ürün veya Hizmet Ekle
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Açıklama"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Marka"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} sm={1}>
            <TextField
              fullWidth
              label="Miktar"
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })}
              size="small"
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Birim"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Malzeme Birim Fiyatı"
              type="number"
              value={newProduct.unitPrice}
              onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
              size="small"
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              disabled={!newProduct.description || !newProduct.unitPrice}
              startIcon={<AddIcon />}
              sx={{ 
                height: '40px',
                background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1976d2 60%, #1565c0 100%)',
                },
              }}
            >
              Ekle
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Excel'e Aktar Butonu */}
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportToExcel}
          disabled={products.length === 0}
        >
          Excel'e Aktar
        </Button>
      </Box>
    </Box>
  );
} 