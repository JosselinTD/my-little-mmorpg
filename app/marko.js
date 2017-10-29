module.exports = function(template, res, datas) {
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
    template.render(datas, res);
};
