import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '../context/ThemeContext';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { getRTLMargin, getRTLPadding, getTextAlign } from '../utils/RTLUtils';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | any;
  category: 'food' | 'accessories' | 'toys' | 'health';
  petType: 'cat' | 'dog' | 'both';
  description: string;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const StoreScreen = () => {
  const colors = useThemeColors();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPetType, setSelectedPetType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'card',
  });
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const cartAnimation = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'all', name: 'الكل', icon: 'grid' },
    { id: 'food', name: 'طعام', icon: 'restaurant' },
    { id: 'accessories', name: 'إكسسوارات', icon: 'shirt' },
    { id: 'toys', name: 'ألعاب', icon: 'game-controller' },
    { id: 'health', name: 'صحة', icon: 'medical' },
  ];

  const petTypes = [
    { id: 'all', name: 'جميع الحيوانات', icon: 'paw' },
    { id: 'cat', name: 'قطط', icon: 'logo-octocat' },
    { id: 'dog', name: 'كلاب', icon: 'paw' },
  ];

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = () => {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'طعام الكلاب المميز',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
        category: 'food',
        petType: 'dog',
        description: 'تغذية عالية الجودة للكلاب البالغة، غني بالبروتين والفيتامينات الضرورية لصحة الكلب',
        inStock: true,
      },
      {
        id: '2',
        name: 'صندوق فضلات القطط',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
        category: 'accessories',
        petType: 'cat',
        description: 'صندوق فضلات ذاتي التنظيف للقطط، سهل الاستخدام والتنظيف',
        inStock: true,
      },
      {
        id: '3',
        name: 'مجموعة ألعاب الحيوانات',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
        category: 'toys',
        petType: 'both',
        description: 'ألعاب تفاعلية للقطط والكلاب، تساعد في الترفيه والتمرين',
        inStock: true,
      },
      {
        id: '4',
        name: 'طوق الكلاب',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop',
        category: 'accessories',
        petType: 'dog',
        description: 'طوق جلدي متين مع بطاقة هوية، آمن ومريح للكلاب',
        inStock: true,
      },
      {
        id: '5',
        name: 'عمود خدش القطط',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop',
        category: 'accessories',
        petType: 'cat',
        description: 'عمود خدش متعدد المستويات للقطط، يحافظ على مخالب القطط',
        inStock: true,
      },
      {
        id: '6',
        name: 'فيتامينات الحيوانات الأليفة',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
        category: 'health',
        petType: 'both',
        description: 'فيتامينات أساسية لصحة الحيوانات الأليفة، تعزز المناعة والصحة العامة',
        inStock: true,
      },
      {
        id: '7',
        name: 'رباط الكلاب',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop',
        category: 'accessories',
        petType: 'dog',
        description: 'رباط قابل للسحب للكلاب، آمن ومتين للمشي والتمرين',
        inStock: false,
      },
      {
        id: '8',
        name: 'طعام القطط',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop',
        category: 'food',
        petType: 'cat',
        description: 'طعام القطط الخالي من الحبوب، صحي ومتوازن التغذية',
        inStock: true,
      },
      // منتجات جديدة من الصور
      {
        id: '9',
        name: 'تربة للقطط 10 لتر شركة بروآرت',
        price: 35.99,
        image: require('../../منتجات/ تربة للقطط 10 لتر شركة بروآرت.png'),
        category: 'accessories',
        petType: 'cat',
        description: 'تربة عالية الامتصاص للقطط من شركة بروآرت، سعة 10 لتر، تحافظ على النظافة والرائحة الطيبة',
        inStock: true,
      },
      {
        id: '10',
        name: 'كات ليتر من شركة إينرجي برائحة اللافندر 10 لتر',
        price: 32.99,
        image: require('../../منتجات/كات ليتر من شركة إينرجي برائحة اللافندر 10 لتر.png'),
        category: 'accessories',
        petType: 'cat',
        description: 'تربة القطط من إينرجي برائحة اللافندر المهدئة، سعة 10 لتر، تمنع الروائح الكريهة',
        inStock: true,
      },
      {
        id: '11',
        name: 'مونيلو أكل القطط الصغيرة نكهة الدجاج والسالمون 1 كيلو',
        price: 28.99,
        image: require('../../منتجات/مونيلو أكل القطط الصغيرة نكهة الدجاج والسالمون 1 كيلو.png'),
        category: 'food',
        petType: 'cat',
        description: 'طعام مخصص للقطط الصغيرة من مونيلو، نكهة الدجاج والسالمون، غني بالبروتين والفيتامينات',
        inStock: true,
      },
      {
        id: '12',
        name: 'مونيلو طعام جاف القطط البالغة نكهة الدجاج والسالمون 1 كيلو',
        price: 26.99,
        image: require('../../منتجات/مونيلو طعام جاف القطط البالغة نكهة الدجاج والسالمون 1 كيلو.png'),
        category: 'food',
        petType: 'cat',
        description: 'طعام جاف للقطط البالغة من مونيلو، نكهة الدجاج والسالمون، متوازن التغذية',
        inStock: true,
      },
    ];
    setProducts(sampleProducts);
  };

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (cartData: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      Alert.alert('نفد المخزون', 'هذا المنتج غير متوفر حالياً');
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      saveCart(updatedCart);
    } else {
      const updatedCart = [...cart, { product, quantity: 1 }];
      setCart(updatedCart);
      saveCart(updatedCart);
    }

    // Add animation
    setAnimatingItems(prev => new Set([...prev, product.id]));
    
    // Enhanced cart animation with bounce effect (reduced duration)
    Animated.sequence([
      Animated.timing(cartAnimation, {
        toValue: 1,
        duration: 80, // Reduced from 150ms to 80ms
        useNativeDriver: true,
      }),
      Animated.spring(cartAnimation, {
        toValue: 0,
        tension: 150, // Increased tension for faster spring
        friction: 4, // Increased friction for quicker settling
        useNativeDriver: true,
      }),
    ]).start();

    // Remove from animating items after animation (reduced timeout)
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 600); // Reduced from 1200ms to 600ms for faster cleanup
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      const updatedCart = cart.filter(item => item.product.id !== productId);
      setCart(updatedCart);
      saveCart(updatedCart);
    } else {
      const updatedCart = cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      setCart(updatedCart);
      saveCart(updatedCart);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPetType = selectedPetType === 'all' || product.petType === selectedPetType || product.petType === 'both';
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPetType && matchesSearch;
  });

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('السلة فارغة', 'يرجى إضافة منتجات إلى السلة أولاً');
      return;
    }
    setCheckoutModalVisible(true);
  };

  const completeCheckout = () => {
    if (!checkoutInfo.name || !checkoutInfo.email || !checkoutInfo.address) {
      Alert.alert('معلومات ناقصة', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    // Simulate payment processing
    Alert.alert(
      'جاري معالجة الدفع...', 
      'يرجى الانتظار...',
      [],
      { cancelable: false }
    );
    
    setTimeout(() => {
      Alert.alert(
        'تم الطلب بنجاح!', 
        `تم تأكيد طلبك بقيمة ${getTotalPrice().toFixed(2)} ريال بنجاح!\n\nسيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.`,
        [
          {
            text: 'موافق',
            onPress: () => {
              setCart([]);
              saveCart([]);
              setCheckoutModalVisible(false);
              setCartModalVisible(false);
              setCheckoutInfo({
                name: '',
                email: '',
                address: '',
                paymentMethod: 'card',
              });
            }
          }
        ]
      );
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryBackground }]}>
      {/* Cart Button - Positioned in top right */}
      <View style={styles.cartButtonContainer}>
        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: colors.primaryAccent }]}
          onPress={() => setCartModalVisible(true)}
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale: cartAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            }}
          >
            <Ionicons name="cart" size={20} color={colors.primaryText} />
          </Animated.View>
          {getTotalItems() > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: colors.errorColor }]}>
              <Text style={[styles.cartBadgeText, { color: '#FFFFFF' }]}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Compact Filter Section */}
      <View style={styles.filterSection}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground, borderColor: colors.glassBorder }]}>
          <Ionicons name="search" size={16} color={colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.primaryText }]}
            placeholder="البحث..."
            placeholderTextColor={colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.glassBorder },
                selectedCategory === category.id && { backgroundColor: colors.primaryAccent, borderColor: colors.primaryAccent },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? '#FFFFFF' : colors.secondaryText}
            />
              <Text
                style={[
                  styles.categoryButtonText,
                  { color: selectedCategory === category.id ? '#FFFFFF' : colors.primaryText },
                  selectedCategory === category.id && { fontWeight: '600' },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pet Type Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petTypeContainer}>
          {petTypes.map((petType) => (
            <TouchableOpacity
              key={petType.id}
              style={[
                styles.petTypeButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.glassBorder },
                selectedPetType === petType.id && { backgroundColor: colors.successColor, borderColor: colors.successColor },
              ]}
              onPress={() => setSelectedPetType(petType.id)}
            >
            <Ionicons
              name={petType.icon as any}
              size={14}
              color={selectedPetType === petType.id ? '#FFFFFF' : colors.secondaryText}
            />
              <Text
                style={[
                  styles.petTypeButtonText,
                  { color: selectedPetType === petType.id ? '#FFFFFF' : colors.primaryText },
                  selectedPetType === petType.id && { fontWeight: '600' },
                ]}
              >
                {petType.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <ScrollView 
        style={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <Animated.View 
              key={product.id} 
              style={[
                styles.productCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.glassBorder },
                animatingItems.has(product.id) && { 
                  transform: [{ scale: 1.05 }],
                  backgroundColor: 'rgba(138, 43, 226, 0.1)',
                  borderColor: colors.successColor,
                  borderWidth: 2,
                }
              ]}
            >
              <Image 
                source={typeof product.image === 'string' ? { uri: product.image } : product.image} 
                style={styles.productImage} 
              />
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.primaryText }]}>{product.name}</Text>
                <Text style={[styles.productDescription, { color: colors.secondaryText }]}>{product.description}</Text>
                <View style={styles.productFooter}>
                  <Text style={[styles.productPrice, { color: colors.primaryAccent }]}>{product.price.toFixed(2)} ريال</Text>
                  <TouchableOpacity
                    style={[
                      styles.addToCartButton,
                      { backgroundColor: colors.primaryAccent },
                      !product.inStock && { backgroundColor: colors.secondaryText },
                      animatingItems.has(product.id) && { backgroundColor: colors.successColor, transform: [{ scale: 1.1 }] },
                    ]}
                    onPress={() => addToCart(product)}
                    disabled={!product.inStock}
                  >
                    <Text
                      style={[
                        styles.addToCartButtonText,
                        { color: '#FFFFFF' }, // White text for purple button
                      ]}
                    >
                      {animatingItems.has(product.id) ? 'تم الإضافة!' : (product.inStock ? 'إضافة للسلة' : 'نفد المخزون')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartModalVisible}
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.cartModalContent, { backgroundColor: colors.cardBackground, borderColor: colors.glassBorder }]}>
            <View style={styles.cartHeader}>
              <Text style={[styles.cartTitle, { color: colors.primaryText }]}>سلة التسوق</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={60} color={Colors.secondaryText} />
                <Text style={styles.emptyCartText}>سلتك فارغة</Text>
              </View>
            ) : (
              <>
                <ScrollView style={styles.cartItems}>
                  {cart.map((item) => (
                    <View key={item.product.id} style={styles.cartItem}>
                      <Image 
                        source={typeof item.product.image === 'string' ? { uri: item.product.image } : item.product.image} 
                        style={styles.cartItemImage} 
                      />
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>{item.product.name}</Text>
                        <Text style={styles.cartItemPrice}>{item.product.price.toFixed(2)} ريال</Text>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                            style={styles.quantityButton}
                          >
                            <Ionicons name="remove" size={16} color={Colors.secondaryText} />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{item.quantity}</Text>
                          <TouchableOpacity
                            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                            style={styles.quantityButton}
                          >
                            <Ionicons name="add" size={16} color={Colors.secondaryText} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.cartFooter}>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>المجموع: {getTotalPrice().toFixed(2)} ريال</Text>
                  </View>
                  <TouchableOpacity style={styles.checkoutButton} onPress={proceedToCheckout}>
                    <Text style={styles.checkoutButtonText}>متابعة الشراء</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={checkoutModalVisible}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.checkoutModalContent, { backgroundColor: colors.cardBackground, borderColor: colors.glassBorder }]}>
            <View style={styles.checkoutHeader}>
              <Text style={styles.checkoutTitle}>تأكيد الطلب</Text>
              <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.secondaryText} />
              </TouchableOpacity>
            </View>

            {/* Order Summary */}
            <View style={styles.orderSummary}>
              <Text style={styles.orderSummaryTitle}>ملخص الطلب</Text>
              {cart.map((item) => (
                <View key={item.product.id} style={styles.orderItem}>
                  <Text style={styles.orderItemName}>{item.product.name}</Text>
                  <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                  <Text style={styles.orderItemPrice}>{(item.product.price * item.quantity).toFixed(2)} ريال</Text>
                </View>
              ))}
              <View style={styles.orderTotal}>
                <Text style={styles.orderTotalText}>المجموع: {getTotalPrice().toFixed(2)} ريال</Text>
              </View>
            </View>
            
            <TextInput
              style={styles.checkoutInput}
              placeholder="الاسم الكامل *"
              placeholderTextColor={Colors.secondaryText}
              value={checkoutInfo.name}
              onChangeText={(text) => setCheckoutInfo({ ...checkoutInfo, name: text })}
            />
            
            <TextInput
              style={styles.checkoutInput}
              placeholder="البريد الإلكتروني *"
              placeholderTextColor={Colors.secondaryText}
              value={checkoutInfo.email}
              onChangeText={(text) => setCheckoutInfo({ ...checkoutInfo, email: text })}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.checkoutInput}
              placeholder="العنوان *"
              placeholderTextColor={Colors.secondaryText}
              value={checkoutInfo.address}
              onChangeText={(text) => setCheckoutInfo({ ...checkoutInfo, address: text })}
              multiline
            />

            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentMethodLabel}>طريقة الدفع</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    checkoutInfo.paymentMethod === 'card' && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setCheckoutInfo({ ...checkoutInfo, paymentMethod: 'card' })}
                >
                  <Ionicons name="card" size={20} color={checkoutInfo.paymentMethod === 'card' ? Colors.primaryAccent : Colors.secondaryText} />
                  <Text style={[styles.paymentOptionText, checkoutInfo.paymentMethod === 'card' && styles.paymentOptionTextSelected]}>
                    بطاقة ائتمان
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    checkoutInfo.paymentMethod === 'paypal' && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setCheckoutInfo({ ...checkoutInfo, paymentMethod: 'paypal' })}
                >
                  <Ionicons name="logo-paypal" size={20} color={checkoutInfo.paymentMethod === 'paypal' ? Colors.primaryAccent : Colors.secondaryText} />
                  <Text style={[styles.paymentOptionText, checkoutInfo.paymentMethod === 'paypal' && styles.paymentOptionTextSelected]}>
                    PayPal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.checkoutFooter}>
              <TouchableOpacity
                style={styles.cancelCheckoutButton}
                onPress={() => setCheckoutModalVisible(false)}
              >
                <Text style={styles.cancelCheckoutButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.placeOrderButton} onPress={completeCheckout}>
                <Text style={styles.placeOrderButtonText}>تأكيد الطلب</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  cartButtonContainer: {
    position: 'absolute',
    bottom: 100, // Positioned in bottom left (above tab bar)
    left: 20, // Left side positioning
    zIndex: 1000, // Higher z-index to ensure it's on top
  },
  filterSection: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 14, // Slightly reduced for corner positioning
    paddingVertical: 8, // Slightly reduced for corner positioning
    borderRadius: 18, // Slightly reduced for corner positioning
    position: 'relative',
    minHeight: 40, // Slightly reduced for corner positioning
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Add shadow for better visibility
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.errorColor,
    borderRadius: 10, // Adjusted for corner positioning
    minWidth: 20, // Adjusted for corner positioning
    height: 20, // Adjusted for corner positioning
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.cardBackground, // White border for better visibility
  },
  cartBadgeText: {
    color: '#FFFFFF', // White text for red badge
    fontSize: 13, // Slightly increased font size
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  searchIcon: {
    ...getRTLMargin(0, 10),
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
    fontSize: 13,
    color: Colors.primaryText,
  },
  categoryContainer: {
    marginBottom: 6,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    minWidth: 80,
    height: 36,
    justifyContent: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  categoryButtonText: {
    ...getRTLMargin(4, 0),
    fontSize: 13,
    color: Colors.primaryText,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF', // White text for purple button
    fontWeight: '600',
  },
  petTypeContainer: {
    marginBottom: 8,
  },
  petTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 18,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    minWidth: 70,
    height: 32,
    justifyContent: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petTypeButtonSelected: {
    backgroundColor: Colors.successColor,
    borderColor: Colors.successColor,
  },
  petTypeButtonText: {
    ...getRTLMargin(3, 0),
    fontSize: 12,
    color: Colors.primaryText,
    textAlign: 'center',
    fontWeight: '500',
  },
  petTypeButtonTextSelected: {
    color: '#FFFFFF', // White text for purple button
    fontWeight: '600',
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 0, // Remove extra padding since grid has its own
    marginTop: 5,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 15,
    gap: 15, // Equal spacing between all cards
  },
  productCard: {
    width: (width - 60) / 2, // Adjusted for better responsive sizing
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
    textAlign: getTextAlign(),
    lineHeight: 18,
  },
  productDescription: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 8,
    textAlign: getTextAlign(),
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  addToCartButton: {
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: Colors.secondaryText,
  },
  addToCartButtonText: {
    color: '#FFFFFF', // White text for purple button
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  addToCartButtonTextDisabled: {
    color: Colors.primaryText,
  },
  productCardAnimating: {
    transform: [{ scale: 1.05 }],
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: Colors.successColor,
    borderWidth: 2,
  },
  addToCartButtonAnimating: {
    backgroundColor: Colors.successColor,
    transform: [{ scale: 1.1 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  cartModalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 10,
  },
  cartItems: {
    maxHeight: 400,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    ...getRTLMargin(0, 15),
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: Colors.primaryAccent,
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.glassBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  cartFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
  },
  totalContainer: {
    marginBottom: 15,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  checkoutButton: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF', // White text for purple button
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutModalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  checkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  orderSummary: {
    backgroundColor: Colors.glassBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginHorizontal: 10,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryAccent,
  },
  orderTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    paddingTop: 10,
    marginTop: 10,
  },
  orderTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  checkoutInput: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: Colors.glassBackground,
    color: Colors.primaryText,
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glassBackground,
  },
  paymentOptionSelected: {
    borderColor: Colors.primaryAccent,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
  },
  paymentOptionText: {
    ...getRTLMargin(5, 0),
    fontSize: 14,
    color: Colors.secondaryText,
  },
  paymentOptionTextSelected: {
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  checkoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelCheckoutButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
  },
  cancelCheckoutButtonText: {
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  placeOrderButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: Colors.primaryAccent,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#FFFFFF', // White text for purple button
    fontWeight: '600',
  },
});

export default StoreScreen;