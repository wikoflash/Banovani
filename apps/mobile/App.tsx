import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { api } from './lib/api';
import { useCartStore } from './lib/cart';

// ─── Colors ──────────────────────────────────────────────────────────────────
const Colors = {
  background: '#FAF7F2',
  surface: '#FFFFFF',
  primaryText: '#1F1F1F',
  secondaryText: '#6F6A64',
  accentBeige: '#D8C3A5',
  accentRose: '#E8C7C8',
  deepBrown: '#2B2420',
  border: '#E8E1D8',
  success: '#2F7D4F',
  error: '#B42318',
  muted: '#F5F1EC',
};

function formatPrice(amount: number): string {
  return `₾${amount.toFixed(2)}`;
}

// ─── Screen types ─────────────────────────────────────────────────────────────
type Screen = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-success';
type NavState = { screen: Screen; params?: Record<string, any> };

// ─── Home Screen ─────────────────────────────────────────────────────────────
function HomeScreen({ navigate }: { navigate: (s: NavState) => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.categories.list(),
      api.products.list({ is_featured: 'true', limit: '6' }),
    ])
      .then(([cats, prods]) => {
        setCategories(cats.categories ?? []);
        setFeatured(prods.products ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.deepBrown} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Banovani</Text>
        <Text style={styles.heroSubtitle}>Georgian Women's Fashion</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigate({ screen: 'shop' })}
        >
          <Text style={styles.primaryButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryChip}
                onPress={() => navigate({ screen: 'shop', params: { category: item.slug } })}
              >
                <Text style={styles.categoryChipText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          />
        </View>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <FlatList
            data={featured}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigate({ screen: 'product', params: { slug: item.slug } })}
              >
                {item.product_images?.[0]?.image_url ? (
                  <Image
                    source={{ uri: item.product_images[0].image_url }}
                    style={styles.productCardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.productCardImage, { backgroundColor: Colors.muted }]} />
                )}
                <Text style={styles.productCardName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productCardPrice}>{formatPrice(item.price)}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          />
        </View>
      )}
    </ScrollView>
  );
}

// ─── Shop Screen ─────────────────────────────────────────────────────────────
function ShopScreen({ navigate, params }: { navigate: (s: NavState) => void; params?: Record<string, any> }) {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    const q: Record<string, string> = { limit: '20' };
    if (search) q.search = search;
    if (params?.category) q.category = params.category;
    api.products
      .list(q)
      .then((data) => setProducts(data.products ?? []))
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, [search, params?.category]);

  useEffect(() => { load(); }, [load]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={Colors.secondaryText}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => load()}
          returnKeyType="search"
        />
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.deepBrown} />
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.gridCard, { flex: 1 }]}
              onPress={() => navigate({ screen: 'product', params: { slug: item.slug } })}
            >
              {item.product_images?.[0]?.image_url ? (
                <Image
                  source={{ uri: item.product_images[0].image_url }}
                  style={styles.gridCardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.gridCardImage, { backgroundColor: Colors.muted }]} />
              )}
              <View style={{ padding: 8 }}>
                <Text style={styles.gridCardName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.gridCardPrice}>{formatPrice(item.price)}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: Colors.secondaryText }}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─── Product Screen ───────────────────────────────────────────────────────────
function ProductScreen({
  slug,
  navigate,
}: {
  slug: string;
  navigate: (s: NavState) => void;
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.products
      .bySlug(slug)
      .then((data) => {
        setProduct(data.product);
        const firstColor = data.product?.product_variants?.[0]?.color ?? null;
        setSelectedColor(firstColor);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.deepBrown} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: Colors.secondaryText }}>Product not found</Text>
      </View>
    );
  }

  const variants = product.product_variants ?? [];
  const colors = [...new Set<string>(variants.map((v: any) => v.color).filter(Boolean))];
  const sizes = [...new Set<string>(variants.map((v: any) => v.size).filter(Boolean))];
  const selectedVariant = variants.find(
    (v: any) =>
      v.is_active &&
      (selectedColor ? v.color === selectedColor : true) &&
      (selectedSize ? v.size === selectedSize : true)
  );
  const primaryImage = product.product_images?.find((i: any) => i.is_primary)?.image_url
    ?? product.product_images?.[0]?.image_url;

  function handleAddToCart() {
    if (!selectedVariant) {
      Alert.alert('Please select a size');
      return;
    }
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      image: primaryImage ?? '',
      color: selectedColor ?? undefined,
      size: selectedSize ?? undefined,
      quantity,
      unitPrice: selectedVariant.price_override ?? product.price,
    });
    Alert.alert('Added to cart!', `${product.name} added to your cart.`, [
      { text: 'Continue Shopping' },
      { text: 'View Cart', onPress: () => navigate({ screen: 'cart' }) },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      {primaryImage ? (
        <Image
          source={{ uri: primaryImage }}
          style={styles.productDetailImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.productDetailImage, { backgroundColor: Colors.muted }]} />
      )}
      <View style={{ padding: 16 }}>
        <Text style={styles.productDetailName}>{product.name}</Text>
        <Text style={styles.productDetailPrice}>
          {formatPrice(selectedVariant?.price_override ?? product.price)}
        </Text>

        {product.short_description && (
          <Text style={styles.productDetailDesc}>{product.short_description}</Text>
        )}

        {colors.length > 0 && (
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>Color: {selectedColor ?? 'Select'}</Text>
            <View style={styles.optionRow}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionChip,
                    selectedColor === color && styles.optionChipSelected,
                  ]}
                  onPress={() => { setSelectedColor(color); setSelectedSize(null); }}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedColor === color && { color: Colors.surface },
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {sizes.length > 0 && (
          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>Size: {selectedSize ?? 'Select'}</Text>
            <View style={styles.optionRow}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionChip,
                    selectedSize === size && styles.optionChipSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedSize === size && { color: Colors.surface },
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Cart Screen ──────────────────────────────────────────────────────────────
function CartScreen({ navigate }: { navigate: (s: NavState) => void }) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= 150 ? 0 : 5;

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={[styles.primaryButton, { marginTop: 16 }]}
          onPress={() => navigate({ screen: 'shop' })}
        >
          <Text style={styles.primaryButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.variantId}
        contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cartItemImage} resizeMode="cover" />
            ) : (
              <View style={[styles.cartItemImage, { backgroundColor: Colors.muted }]} />
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              {item.color && <Text style={styles.cartItemVariant}>Color: {item.color}</Text>}
              {item.size && <Text style={styles.cartItemVariant}>Size: {item.size}</Text>}
              <Text style={styles.cartItemPrice}>{formatPrice(item.unitPrice)}</Text>
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.variantId, item.quantity - 1)}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(item.variantId, item.quantity + 1)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 'auto' }}
                  onPress={() => removeItem(item.variantId)}
                >
                  <Text style={{ color: Colors.error, fontSize: 12 }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.cartSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 8 }]}>
          <Text style={[styles.summaryLabel, { fontWeight: '700', fontSize: 16 }]}>Total</Text>
          <Text style={[styles.summaryValue, { fontWeight: '700', fontSize: 16 }]}>
            {formatPrice(subtotal + deliveryFee)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addToCartButton, { marginTop: 16 }]}
          onPress={() => navigate({ screen: 'checkout' })}
        >
          <Text style={styles.addToCartButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Checkout Screen ──────────────────────────────────────────────────────────
function CheckoutScreen({ navigate }: { navigate: (s: NavState) => void }) {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    comment: '',
    deliveryMethod: 'tbilisi',
    paymentMethod: 'cash_on_delivery',
  });
  const [submitting, setSubmitting] = useState(false);
  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= 150 ? 0 : form.deliveryMethod === 'regional' ? 10 : form.deliveryMethod === 'pickup' ? 0 : 5;

  async function handleSubmit() {
    if (!form.firstName || !form.phone || !form.city || !form.address) {
      Alert.alert('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const data = await api.checkout({
        ...form,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });
      clearCart();
      navigate({ screen: 'order-success', params: { orderId: data.orderId, orderNumber: data.orderNumber } });
    } catch (err: any) {
      Alert.alert('Order Failed', err.message ?? 'Please try again');
    } finally {
      setSubmitting(false);
    }
  }

  function field(label: string, key: keyof typeof form, opts?: { required?: boolean; keyboardType?: any }) {
    return (
      <View style={styles.formField}>
        <Text style={styles.formLabel}>{label}{opts?.required && ' *'}</Text>
        <TextInput
          style={styles.formInput}
          value={form[key] as string}
          onChangeText={(val) => setForm((f) => ({ ...f, [key]: val }))}
          keyboardType={opts?.keyboardType}
          placeholderTextColor={Colors.secondaryText}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.sectionTitle}>Contact</Text>
      {field('First Name', 'firstName', { required: true })}
      {field('Last Name', 'lastName')}
      {field('Phone', 'phone', { required: true, keyboardType: 'phone-pad' })}
      {field('Email', 'email', { keyboardType: 'email-address' })}

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Delivery</Text>
      {field('City', 'city', { required: true })}
      {field('Address', 'address', { required: true })}
      {field('Comment', 'comment')}

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery</Text>
        <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</Text>
      </View>
      <View style={[styles.summaryRow, { marginTop: 8 }]}>
        <Text style={[styles.summaryLabel, { fontWeight: '700' }]}>Total</Text>
        <Text style={[styles.summaryValue, { fontWeight: '700' }]}>{formatPrice(subtotal + deliveryFee)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.addToCartButton, { marginTop: 24 }, submitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.addToCartButtonText}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Order Success Screen ─────────────────────────────────────────────────────
function OrderSuccessScreen({
  params,
  navigate,
}: {
  params?: Record<string, any>;
  navigate: (s: NavState) => void;
}) {
  return (
    <View style={styles.centered}>
      <Text style={{ fontSize: 48 }}>✅</Text>
      <Text style={[styles.heroTitle, { marginTop: 12 }]}>Order Placed!</Text>
      <Text style={[styles.heroSubtitle, { marginTop: 8, textAlign: 'center', paddingHorizontal: 24 }]}>
        Order #{params?.orderNumber} confirmed. We will contact you shortly.
      </Text>
      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: 24 }]}
        onPress={() => navigate({ screen: 'home' })}
      >
        <Text style={styles.primaryButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({
  active,
  navigate,
}: {
  active: Screen;
  navigate: (s: NavState) => void;
}) {
  const cartCount = useCartStore((s) => s.getTotalItems());

  return (
    <View style={styles.tabBar}>
      {([
        { screen: 'home', label: '🏠 Home' },
        { screen: 'shop', label: '👗 Shop' },
        { screen: 'cart', label: `🛍 Cart${cartCount > 0 ? ` (${cartCount})` : ''}` },
      ] as { screen: Screen; label: string }[]).map(({ screen, label }) => (
        <TouchableOpacity
          key={screen}
          style={[styles.tabItem, active === screen && styles.tabItemActive]}
          onPress={() => navigate({ screen })}
        >
          <Text style={[styles.tabLabel, active === screen && styles.tabLabelActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [nav, setNav] = useState<NavState>({ screen: 'home' });

  const navigate = useCallback((s: NavState) => setNav(s), []);
  const showTabs = ['home', 'shop', 'cart'].includes(nav.screen);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.appHeader}>
        {!showTabs && (
          <TouchableOpacity onPress={() => navigate({ screen: 'home' })} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.appTitle}>Banovani</Text>
      </View>

      {/* Screen */}
      <View style={{ flex: 1 }}>
        {nav.screen === 'home' && <HomeScreen navigate={navigate} />}
        {nav.screen === 'shop' && <ShopScreen navigate={navigate} params={nav.params} />}
        {nav.screen === 'product' && nav.params?.slug && (
          <ProductScreen slug={nav.params.slug} navigate={navigate} />
        )}
        {nav.screen === 'cart' && <CartScreen navigate={navigate} />}
        {nav.screen === 'checkout' && <CheckoutScreen navigate={navigate} />}
        {nav.screen === 'order-success' && (
          <OrderSuccessScreen params={nav.params} navigate={navigate} />
        )}
      </View>

      {/* Tab Bar */}
      {showTabs && <TabBar active={nav.screen} navigate={navigate} />}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  appTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: Colors.deepBrown, letterSpacing: 2 },
  backButton: { position: 'absolute', left: 16, zIndex: 1, paddingVertical: 4 },
  backButtonText: { color: Colors.deepBrown, fontSize: 14 },
  hero: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#D8C3A544',
    margin: 16,
    borderRadius: 16,
  },
  heroTitle: { fontSize: 28, fontWeight: '700', color: Colors.deepBrown, letterSpacing: 2 },
  heroSubtitle: { fontSize: 14, color: Colors.secondaryText, marginTop: 4 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.deepBrown, paddingHorizontal: 16, marginBottom: 12 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  categoryChipText: { fontSize: 13, color: Colors.primaryText },
  productCard: { width: 160, backgroundColor: Colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  productCardImage: { width: 160, height: 200 },
  productCardName: { fontSize: 13, color: Colors.primaryText, padding: 8, paddingBottom: 4, fontWeight: '500' },
  productCardPrice: { fontSize: 13, color: Colors.deepBrown, paddingHorizontal: 8, paddingBottom: 8, fontWeight: '600' },
  gridCard: { backgroundColor: Colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  gridCardImage: { width: '100%', aspectRatio: 3 / 4 },
  gridCardName: { fontSize: 13, color: Colors.primaryText, fontWeight: '500' },
  gridCardPrice: { fontSize: 13, color: Colors.deepBrown, fontWeight: '600', marginTop: 2 },
  searchBar: { padding: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchInput: { backgroundColor: Colors.muted, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: Colors.primaryText },
  productDetailImage: { width: '100%', aspectRatio: 3 / 4 },
  productDetailName: { fontSize: 20, fontWeight: '700', color: Colors.deepBrown, marginTop: 8 },
  productDetailPrice: { fontSize: 18, fontWeight: '600', color: Colors.primaryText, marginTop: 4 },
  productDetailDesc: { fontSize: 14, color: Colors.secondaryText, marginTop: 8, lineHeight: 20 },
  optionGroup: { marginTop: 16 },
  optionLabel: { fontSize: 14, fontWeight: '600', color: Colors.primaryText, marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  optionChipSelected: { backgroundColor: Colors.deepBrown, borderColor: Colors.deepBrown },
  optionChipText: { fontSize: 13, color: Colors.primaryText },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  qtyButton: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  qtyButtonText: { fontSize: 18, color: Colors.primaryText },
  qtyValue: { fontSize: 16, fontWeight: '600', color: Colors.primaryText, minWidth: 24, textAlign: 'center' },
  addToCartButton: { backgroundColor: Colors.deepBrown, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  addToCartButtonText: { color: Colors.surface, fontSize: 15, fontWeight: '600' },
  cartItem: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  cartItemImage: { width: 72, height: 96, borderRadius: 8 },
  cartItemName: { fontSize: 14, fontWeight: '600', color: Colors.primaryText },
  cartItemVariant: { fontSize: 12, color: Colors.secondaryText, marginTop: 2 },
  cartItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.deepBrown, marginTop: 4 },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { fontSize: 14, color: Colors.secondaryText },
  summaryValue: { fontSize: 14, color: Colors.primaryText },
  formField: { marginBottom: 12 },
  formLabel: { fontSize: 13, fontWeight: '500', color: Colors.primaryText, marginBottom: 4 },
  formInput: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: Colors.primaryText },
  primaryButton: { backgroundColor: Colors.deepBrown, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center' },
  primaryButtonText: { color: Colors.surface, fontSize: 14, fontWeight: '600' },
  emptyText: { fontSize: 16, color: Colors.secondaryText },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabItemActive: { borderTopWidth: 2, borderTopColor: Colors.deepBrown },
  tabLabel: { fontSize: 12, color: Colors.secondaryText },
  tabLabelActive: { color: Colors.deepBrown, fontWeight: '600' },
});
