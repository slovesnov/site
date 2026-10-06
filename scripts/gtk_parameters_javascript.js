/*p=['-IC:/soft/msys64/mingw64/include/gtk-3.0 -IC:/soft/msys64/mingw64/include/pango-1.0 -IC:/soft/msys64/mingw64/include -IC:/soft/msys64/mingw64/include/glib-2.0 -IC:/soft/msys64/mingw64/lib/glib-2.0/include -IC:/soft/msys64/mingw64/include/harfbuzz -IC:/soft/msys64/mingw64/include/freetype2 -IC:/soft/msys64/mingw64/include/libpng16 -mms-bitfields -IC:/soft/msys64/mingw64/include/fribidi -IC:/soft/msys64/mingw64/include/cairo -IC:/soft/msys64/mingw64/include/lzo -IC:/soft/msys64/mingw64/include/pixman-1 -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -IC:/soft/msys64/mingw64/include/gdk-pixbuf-2.0 -mms-bitfields -mms-bitfields -mms-bitfields -IC:/soft/msys64/mingw64/include/atk-1.0 -mms-bitfields -mms-bitfields -mms-bitfields -pthread -mms-bitfields'
,'-LC:/soft/msys64/mingw64/lib -lgtk-3 -lgdk-3 -lz -lgdi32 -limm32 -lshell32 -lole32 -Wl,-luuid -lwinmm -ldwmapi -lsetupapi -lcfgmgr32 -lhid -lpangowin32-1.0 -lpangocairo-1.0 -lpango-1.0 -lharfbuzz -latk-1.0 -lcairo-gobject -lcairo -lgdk_pixbuf-2.0 -lgio-2.0 -lgobject-2.0 -lglib-2.0 -lintl'
,'-IC:/soft/msys64/mingw64/include/gtk-3.0 -IC:/soft/msys64/mingw64/include/pango-1.0 -IC:/soft/msys64/mingw64/include -IC:/soft/msys64/mingw64/include/glib-2.0 -IC:/soft/msys64/mingw64/lib/glib-2.0/include -IC:/soft/msys64/mingw64/include/harfbuzz -IC:/soft/msys64/mingw64/include/freetype2 -IC:/soft/msys64/mingw64/include/libpng16 -mms-bitfields -IC:/soft/msys64/mingw64/include/fribidi -IC:/soft/msys64/mingw64/include/cairo -IC:/soft/msys64/mingw64/include/lzo -IC:/soft/msys64/mingw64/include/pixman-1 -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -mms-bitfields -IC:/soft/msys64/mingw64/include/gdk-pixbuf-2.0 -mms-bitfields -mms-bitfields -mms-bitfields -IC:/soft/msys64/mingw64/include/atk-1.0 -mms-bitfields -mms-bitfields -mms-bitfields -pthread -mms-bitfields -LC:/soft/msys64/mingw64/lib -lgtk-3 -lgdk-3 -lz -lgdi32 -limm32 -lshell32 -lole32 -Wl,-luuid -lwinmm -ldwmapi -lsetupapi -lcfgmgr32 -lhid -lpangowin32-1.0 -lpangocairo-1.0 -lpango-1.0 -lharfbuzz -latk-1.0 -lcairo-gobject -lcairo -lgdk_pixbuf-2.0 -lgio-2.0 -lgobject-2.0 -lglib-2.0 -lintl']
*/

function load() {
	la = gLanguage == 'russian' ? ['вставьте вывод одной из команд сюда', 'результаты будут здесь']
		: ['paste output one of the commands here', 'results will be here'];
	['in', 'out'].forEach((e, i) => el(e).placeholder = la[i])

	// el('in').value = p[0]
	// c()
}

function c() {
	el('out').innerHTML = parse(el('in').value)
}

function uploadFiles() {
	files = el('selectfile').files;
	[...files].forEach(e => {
		let reader = new FileReader();
		reader.onload = () => {
			el('in').value = reader.result
			c()
		}
		reader.onerror = () => console.log(reader.error)
		reader.readAsText(e);
	});
}

function parse(p) {
	const q = 'I$lLW'
	const l = q.length - 1
	a = Array.from({ length: l + 1 }, () => [])
	b = i => [1, l].includes(i);
	[...new Set(p.trim().split(/\s+/))].sort().forEach(e => {
		i = q.indexOf(e[1]);
		if (i == -1) {
			i = 1;
		}
		a[i].push(e.slice(b(i) ? 0 : 2))
	});

	if (a[2].length) {//check libs 2 has linker options
		a[l].push('-mwindows')
	}

	return a.map((e, i) => e.join('\n '[+b(i)])).filter(e => e.length).join('\n\n');
}
