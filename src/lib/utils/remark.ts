import { visit } from "unist-util-visit";

export function remarkDirectivePlaceholders() {
	return (tree: any) => {
		visit(tree, (node, index, parent) => {
			if (!parent) return;

			const isDirective =
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective";

			if (!isDirective) return;

			// const payload = { type: node.name, props };
			const payload = JSON.stringify({ type: node.name, props: node.attributes || {} });

			const placeholderNodes = [
				{
					type: "html",
					value: `<!--component-start:${payload}-->`,
				},
				...(node.type === "containerDirective" ? node.children : []),
				{
					type: "html",
					value: `<!--component-end-->`,
				},
			];

			parent.children.splice(index, 1, ...placeholderNodes);
		});
	};
}
