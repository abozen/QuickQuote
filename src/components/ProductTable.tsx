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
    const updatedProducts = [...products, product];
    const newSubtotal = updatedProducts.reduce((sum, product) => sum + product.totalPrice, 0);
    const newVatAmount = vatIncluded ? newSubtotal * (vatRate / 100) : 0;
    
    onChange(updatedProducts);
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
      {/* New Product Form - Moved to top */}
      <Box sx={{ mb: 3, p: 2, background: '#f8fafd', borderRadius: 2 }}>
        <Typography fontWeight={700} mb={2}>Yeni Ürün Ekle</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Açıklama"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Marka"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <TextField
              fullWidth
              label="Miktar"
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <TextField
              fullWidth
              label="Birim"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Birim Fiyat"
              type="number"
              value={newProduct.unitPrice}
              onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
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
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Ürün eklenmedi
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <Draggable key={product.id} draggableId={product.id} index={index}>
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{product.unit}</TableCell>
                            <TableCell>{formatNumber(product.unitPrice)}</TableCell>
                            <TableCell>{formatNumber(product.totalPrice)}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleEditProduct(product)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteProduct(product.id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))
                  )}
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