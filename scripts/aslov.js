function load(){
    gs.forEach((e, i) => {
        el('c' + i, codeString(e, "cpp"))
    });
    Prism.highlightAll();
    console.log(gs.length)
}

gs=[`template <typename T, auto FreeFunc> struct GtkResourceDeleter {
  void operator()(T *resource) const {
    if (resource) {
      FreeFunc(resource);
    }
  }
};

template <typename T, auto FreeFunc>
using UniqueGtkResource = std::unique_ptr<T, GtkResourceDeleter<T, FreeFunc>>;

using SafeGRegex = UniqueGtkResource<GRegex, g_regex_unref>;
using SafePangoFontDesc =
    UniqueGtkResource<PangoFontDescription, pango_font_description_free>;
using SafePixbuf = UniqueGtkResource<GdkPixbuf, g_object_unref>;
using SafeCairo = UniqueGtkResource<cairo_t, cairo_destroy>;
using SafeCairoSurface =
    UniqueGtkResource<cairo_surface_t, cairo_surface_destroy>;`,`class CPoint {
public:
  int x, y;
  CPoint();
  CPoint(int _x, int _y);
  CPoint(GdkEventButton *p);
  void operator+=(const CPoint &p);
  void operator-=(const CPoint &p);
  bool operator==(const CPoint &p) const;
  bool operator!=(const CPoint &p) const;
  std::string toString() const;
};

std::ostream &operator<<(std::ostream &os, const CPoint &p);
std::istream &operator>>(std::istream &is, CPoint &p);`,`class CRect {
public:
  int left;
  int top;
  int right;
  int bottom;

  CRect();
  CRect(CPoint p, CPoint s);
  CRect(int _left, int _top, int _right, int _bottom);
  const CRect &operator=(const CRect &r);

  void init(int _left, int _top, int _right, int _bottom);
  void join(const CRect &r);

  int width() const;
  int height() const;
  CPoint size() const;
  CPoint centerPoint() const;
  CPoint topLeft() const;

  bool in(GdkEventButton *p);
  bool in(double x, double y);

  std::string toString() const;
};

std::ostream &operator<<(std::ostream &os, const CRect &p);
std::istream &operator>>(std::istream &is, CRect &p);`,`class Pixbuf {
	SafePixbuf p;
public:
	Pixbuf();
	Pixbuf(std::string_view path);
	Pixbuf(GdkPixbuf *pb);
	void set(std::string_view path);
	void set(GdkPixbuf *pb);

	void operator=(std::string_view path);
	void operator=(GdkPixbuf *pb);

	operator GdkPixbuf*();

	Pixbuf& operator=(const Pixbuf&) = delete;
	Pixbuf(const Pixbuf&) = delete;

	int width() const;
	int height() const;
	CPoint size() const;

	void createRGB(int width, int height);
	void savePng(std::string const &path) const;
	void saveJpg(std::string const &path, int quality = 100) const;
	GdkPixbuf* saturate(float f) const;
};`,`class CairoSurface {
  SafeCairo m_cairo;
  SafeCairoSurface m_surface;

public:
  CairoSurface();
  CairoSurface(int width, int height);
  CairoSurface(CPoint const &size);
  CairoSurface &operator=(const CairoSurface &) = delete;
  CairoSurface(const CairoSurface &) = delete;

  void create(int width, int height);
  void create(CPoint const &size);
  void create(std::string const &path);

  int width() const;
  int height() const;
  CPoint size() const;

  void copy(CairoSurface &dest);
  void copy(CairoSurface &dest, CRect const &r);
  void copy(CairoSurface &dest, int destx, int desty, int width, int height);
  void copy(CairoSurface &dest, int destx, int desty, int width, int height,
            int sourcex, int sourcey);
  void copyToCairo(cairo_t *cr, int destx, int desty, int width, int height,
                   int sourcex, int sourcey);

  operator cairo_t *();
  operator cairo_surface_t *();
  void savePng(std::string const &path) const;

  GdkPixbuf *toPixbuf(int startx, int starty, int width, int height);
  GdkPixbuf *toPixbuf();

};`,`class CheckNewVersion {
	std::string m_version;
	GThread *m_newVersionThread;
	GSourceFunc m_callback;
public:
	std::string m_message;
	void start(std::string version, GSourceFunc callback);
	void routine();
};`];